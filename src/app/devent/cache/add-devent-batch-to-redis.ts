import { redisClient } from '@common/redis/create-redis-client';
import { Devent } from '../entity/devent';

export const addDeventBatchToRedis = async (
	deventBatch: Devent[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!deventBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	deventBatch.forEach(({ id = '', name = '', condition = '', sensors = [] }) =>
		multi.json.set(`${baseKey}${id}`, '$', {
			id,
			name,
			condition,
			sensors,
		}),
	);
	return multi.exec();
};
