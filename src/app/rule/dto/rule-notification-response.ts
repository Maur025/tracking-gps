import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleNotificationResponse = BaseData.extend({
	rule_id: string().nonempty(),
	channel_id: string().nonempty(),
	channel_data: string(),
});

export type RuleNotificationResponse = z.infer<typeof RuleNotificationResponse>;
