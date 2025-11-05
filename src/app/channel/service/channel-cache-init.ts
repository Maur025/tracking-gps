import z, { array, object } from 'zod/v4';
import { ChannelResponse } from '../dto/response/channel-response.js';
import { loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import ChannelCache from '../cache/channel-cache.js';
import { Channel } from '../entity/channel.js';
import { CProtocol } from '../entity/c-protocol.js';
import { CProtocolResponse } from '../dto/response/c-protocol-response.js';
import { CProtocolName } from '../entity/c-protocol-name.js';
import { getObjectOfString } from '@utils/get-object-of-string.js';
import { fixCommasInJsonString } from '@utils/fix-commas-in-json-string.js';
import { ChannelData } from '../entity/channel-data.js';
import { ChannelDataParams } from '../entity/channel-data-params.js';
import { ChannelDataUserParams } from '../entity/channel-data-user-params.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { addChannelBatchToRedis } from '../cache/add-channel-batch-to-redis.js';

const ChannelCacheInitRequest = object({
	channelResponseList: array(ChannelResponse).default([]),
});

type ChannelCacheInitRequest = z.infer<typeof ChannelCacheInitRequest>;

export const channelCacheInit = async (
	request: ChannelCacheInitRequest,
): Promise<void> => {
	const { channelResponseList } = ChannelCacheInitRequest.parse(request);

	if (!channelResponseList?.length) {
		loggerError(
			`[CHANNEL] (channelCacheInit) channel response undefined or empty]`,
		);

		return;
	}

	const channelCache = container.resolve(ChannelCache);

	channelCache.clear();

	const channelList: Channel[] = channelResponseList.map(
		({ id, name, data, cprotocol_id, cprotocol }) => ({
			id,
			name,
			data: getChannelData(data),
			cProtocolId: cprotocol_id,
			cProtocol: getCProtocolData(cprotocol),
		}),
	);

	channelCache.addMany(channelList);

	await addDataInBatch<Channel>({
		dataList: channelList,
		dataBaseKey: channelCache.getRedisKey(),
		registerInRedisFn: addChannelBatchToRedis,
	});
};

const getCProtocolData = ({
	id,
	name,
	script,
}: CProtocolResponse): CProtocol => ({
	id,
	name: CProtocolName.parse(name),
	script,
});

const getChannelData = (channelDataResponse: string): ChannelData => {
	const channelDataStringFixed: string =
		fixCommasInJsonString(channelDataResponse);

	const channelData: {
		params: ChannelDataParams[];
		userparams: ChannelDataUserParams[];
	} = getObjectOfString(channelDataStringFixed);

	return {
		params: channelData?.params?.map(param => ({ ...param })),
		userParams: channelData?.userparams
			? channelData?.userparams?.map(userParam => ({ ...userParam }))
			: [],
	};
};
