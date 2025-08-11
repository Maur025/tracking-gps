import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';

export const RuleFrequency = BaseData.extend({
	ruleId: string().nonempty(),
	startTime: number().nonnegative(),
	endTime: number().nonnegative(),
	frequency: string().nonempty(),
});

export type RuleFrequency = z.infer<typeof RuleFrequency>;
