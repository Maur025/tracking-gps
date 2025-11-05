import { redisClient } from '@common/redis/create-redis-client.js';
import { Group } from '../entity/group.js';

export const addGroupBatchToRedis = async (
	groupBatch: Group[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!groupBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	groupBatch.forEach(
		({ id = '', name = '', description = '', vehicles = [] }) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				name,
				description,
				vehicles,
			}),
	);

	return multi.exec();
};
