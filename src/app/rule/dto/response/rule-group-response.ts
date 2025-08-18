import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleGroupResponse = BaseData.extend({
	rule_id: string().nonempty(),
	group_id: string().nonempty(),
});

export type RuleGroupResponse = z.infer<typeof RuleGroupResponse>;
