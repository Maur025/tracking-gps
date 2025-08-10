import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleResponse = BaseData.extend({
	name: string().optional(),
});

export type RuleResponse = z.infer<typeof RuleResponse>;
