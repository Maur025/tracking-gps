import { BaseData } from '@maur025/core-model-data';
import { CProtocolName } from './c-protocol-name';
import z, { string } from 'zod/v4';

export const CProtocol = BaseData.extend({
	name: CProtocolName,
	script: string().nullable().optional(),
});

export type CProtocol = z.infer<typeof CProtocol>;
