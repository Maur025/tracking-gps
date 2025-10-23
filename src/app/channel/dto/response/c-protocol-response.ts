import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const CProtocolResponse = BaseData.extend({
	name: string().nonempty(),
	script: string().nullable().optional(),
});

export type CProtocolResponse = z.infer<typeof CProtocolResponse>;
