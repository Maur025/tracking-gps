import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const Rule = BaseData.extend({
	name: string().optional(),
});

export type Rule = z.infer<typeof Rule>;
