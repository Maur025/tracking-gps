import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { CProtocolResponse } from './c-protocol-response';

export const ChannelResponse = BaseData.extend({
	name: string().nonempty(),
	data: string().nonempty(),
	cprotocol_id: string().nonempty(),
	cprotocol: CProtocolResponse,
});

export type ChannelResponse = z.infer<typeof ChannelResponse>;
