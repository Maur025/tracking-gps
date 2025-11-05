import { redisClient } from '@common/redis/create-redis-client.js';
import { Channel } from '../entity/channel.js';

export const addChannelBatchToRedis = async (
	channelBatch: Channel[],
	baseKey: string,
): Promise<unknown[] | null> => {
	if (!channelBatch?.length) {
		return null;
	}

	const multi = redisClient.multi();

	channelBatch.forEach(
		({ id = '', name = '', data = {}, cProtocolId = '', cProtocol = {} }) =>
			multi.json.set(`${baseKey}${id}`, '$', {
				id,
				name,
				data,
				cProtocolId,
				cProtocol,
			}),
	);

	return multi.exec();
};
