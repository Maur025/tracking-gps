import z, { object, string, number, array, any } from 'zod/v4';
import { redisClient } from '../create-redis-client';
import { loggerError } from '@maur025/core-logger';

export const SearchByIndexInRedisRequest = object({
	index: string().nonempty(),
	query: string().nonempty(),
	options: object({
		LIMIT: object({
			from: number().optional(),
			size: number().optional(),
		}).optional(),
	}).optional(),
});

export const SearchByIndexInRedisResult = object({
	total: number().nonnegative(),
	documents: array(
		object({
			id: string().nonempty(),
			value: any(),
		}),
	).default([]),
});

export type SearchByIndexInRedisRequest = z.infer<
	typeof SearchByIndexInRedisRequest
>;
export type SearchByIndexInRedisResult<T> = Omit<
	z.infer<typeof SearchByIndexInRedisResult>,
	'documents'
> & {
	documents: { id: string; value: T }[];
};

export const searchByIndexInRedis = async <E>(
	request: SearchByIndexInRedisRequest,
): Promise<SearchByIndexInRedisResult<E> | undefined> => {
	const { index, query, options } = SearchByIndexInRedisRequest.parse(request);

	const result = await redisClient.ft.search(index, query, {
		...(options as object),
	});

	if (typeof result !== 'object') {
		loggerError(
			`[REDIS] (searchByIndexInRedis) Search result expected should be an object, but received a ${typeof result}.`,
		);

		return undefined;
	}

	return result as SearchByIndexInRedisResult<E>;
};

const SearchManyByIndexInRedisRequest = object({
	index: string().nonempty(),
	indexField: string().nonempty(),
	valueList: array(string()).nonempty(),
	options: object({
		LIMIT: object({
			from: number().optional(),
			size: number().optional(),
		}).optional(),
	}).optional(),
});

type SearchManyByIndexInRedisRequest = z.infer<
	typeof SearchManyByIndexInRedisRequest
>;

export const searchManyByIndexInRedis = async <E>(
	request: SearchManyByIndexInRedisRequest,
): Promise<SearchByIndexInRedisResult<E>[]> => {
	const { index, indexField, valueList, options } =
		SearchManyByIndexInRedisRequest.parse(request);

	const multi = redisClient.multi();

	valueList.forEach(value =>
		multi.ft.search(index, `@${indexField}:${value}`, {
			...(options as object),
		}),
	);

	const result = await multi.exec();

	if (!Array.isArray(result) || !result?.length) {
		loggerError(
			`[REDIS] (searchManyByIndexInRedis) Search result expected should be a array with documents`,
		);

		return [];
	}

	if (typeof result[0] !== 'object') {
		loggerError(
			`[REDIS] (searchManyByIndexInRedis) Search result expected should be an object, but received a ${typeof result}. `,
		);

		return [];
	}

	return result as unknown as SearchByIndexInRedisResult<E>[];
};
