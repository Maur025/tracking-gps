import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleNotification = BaseData.extend({
	ruleId: string().nonempty(),
	channelId: string().nonempty(),
	channelData: string(),
});

export type RuleNotification = z.infer<typeof RuleNotification>;
