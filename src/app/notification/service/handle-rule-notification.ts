import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { RuleNotification } from '@app/rule/entity/rule-notification';
import z, { array, object } from 'zod/v4';

const HandleRuleNotificationRequest = object({
	notifications: array(RuleNotification).default([]),
	notificationToLaunch: array(DeviceRuleAlertToLaunch).default([]),
});

type HandleRuleNotificationRequest = z.infer<
	typeof HandleRuleNotificationRequest
>;

export const handleRuleNotification = async (
	request: HandleRuleNotificationRequest,
): Promise<void> => {
	const { notifications, notificationToLaunch } =
		HandleRuleNotificationRequest.parse(request);

	console.log(notifications);
	console.log(notificationToLaunch);
};
