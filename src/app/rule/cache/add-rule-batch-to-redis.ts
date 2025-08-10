import { redisClient } from '@common/redis/create-redis-client';
import { Rule } from '../entity/rule';

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
			frecuency = [],
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
				frecuency,
				events,
				groups,
				vehicles,
				notifications,
				geofences,
			}),
	);

	return multi.exec();
};
