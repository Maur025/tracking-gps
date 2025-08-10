import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';

export const RuleFrequencyResponse = BaseData.extend({
	rule_id: string().nonempty(),
	start_time: number().nonnegative(),
	end_time: number().nonnegative(),
	frequency: string().nonempty(),
});

export type RuleFrequencyResponse = z.infer<typeof RuleFrequencyResponse>;
