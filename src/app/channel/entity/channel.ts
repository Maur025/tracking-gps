import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { CProtocol } from './c-protocol.js';
import { ChannelData } from './channel-data.js';

export const Channel = BaseData.extend({
	name: string().nonempty(),
	data: ChannelData,
	cProtocolId: string().nonempty(),
	cProtocol: CProtocol,
});

export type Channel = z.infer<typeof Channel>;
