import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleEventResponse = BaseData.extend({
	rule_id: string().nonempty(),
	devent_id: string().nonempty(),
	operator: string(),
	value: string(),
});

export type RuleEventResponse = z.infer<typeof RuleEventResponse>;
