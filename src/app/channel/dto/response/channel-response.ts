import { BaseData } from '@maur025/core-model-data';
import z, { preprocess, string } from 'zod/v4';
import { CProtocolResponse } from './c-protocol-response.js';

export const ChannelResponse = BaseData.extend({
	id: preprocess(value => {
		return String(value);
	}, string()),
	name: string().nonempty(),
	data: string().nonempty(),
	cprotocol_id: string().nonempty(),
	cprotocol: CProtocolResponse,
});

export type ChannelResponse = z.infer<typeof ChannelResponse>;
