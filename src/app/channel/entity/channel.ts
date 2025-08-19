import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { CProtocol } from './c-protocol';

export const Channel = BaseData.extend({
	name: string().nonempty(),
	data: string().nonempty(),
	cProtocolId: string().nonempty(),
	cProtocol: CProtocol,
});

export type Channel = z.infer<typeof Channel>;
