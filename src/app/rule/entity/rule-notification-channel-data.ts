import z, { object, string } from 'zod/v4';

export const RuleNotificationChannelData = object({
	tomail: string().nonempty().optional(),
	title: string().nonempty().optional(),
	message: string().nonempty(),
});

export type RuleNotificationChannelData = z.infer<
	typeof RuleNotificationChannelData
>;
