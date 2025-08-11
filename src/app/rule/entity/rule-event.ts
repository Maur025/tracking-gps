import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleEvent = BaseData.extend({
	ruleId: string().nonempty(),
	deventId: string().nonempty(),
	operator: string(),
	value: string(),
});

export type RuleEvent = z.infer<typeof RuleEvent>;
