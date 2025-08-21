import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { RuleNotificationChannelData } from './rule-notification-channel-data';

export const RuleNotification = BaseData.extend({
	ruleId: string().nonempty(),
	channelId: string().nonempty(),
	channelData: RuleNotificationChannelData.optional(),
});

export type RuleNotification = z.infer<typeof RuleNotification>;
