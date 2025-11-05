import { redisClient } from '@common/redis/create-redis-client.js';
import { Rule } from '../entity/rule.js';

export const addRuleBatchToRedis = async (
	ruleBatch: Rule[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!ruleBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	ruleBatch.forEach(
		({
			id = '',
			name = '',
			description = '',
			type = '',
			inout = '',
			enabled = 0,
			deleted = 0,
			alerts = [],
			frequencies = [],
			events = [],
			groups = [],
			vehicles = [],
			notifications = [],
			geofences = [],
		}) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				name,
				description,
				type,
				inout,
				enabled,
				deleted,
				alerts,
				frequencies,
				events,
				groups,
				vehicles,
				notifications,
				geofences,
			}),
	);

	return multi.exec();
};
