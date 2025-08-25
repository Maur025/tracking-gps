import DeventCache from '@app/devent/cache/devent-cache';
import { Devent } from '@app/devent/entity/devent';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { RuleResultEventComparation } from '@app/rule/dto/rule-result-event-comparation';
import { container } from 'tsyringe';
import { processEventSelector } from './process-event-selector';
import { loggerDebug } from '@maur025/core-logger';
import z, { object } from 'zod/v4';
import { Rule } from '@app/rule/entity/rule';
import { Device } from '@app/device/entity/device';
import { handleRuleNotification } from '@app/notification/service/handle-rule-notification';
import { notificationBuildByAlertList } from './notification-build-by-alert-list';
import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';

const loggerAuxMessage: string = `[RULE] (handleSingleEvent)`;

const HandleSingleEventRequest = object({
	rule: Rule,
	device: Device,
});

type HandleSingleEventRequest = z.infer<typeof HandleSingleEventRequest>;

export const handleSingleEvent = async (
	request: HandleSingleEventRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { rule, device } = HandleSingleEventRequest.parse(request);

	const deventCache = container.resolve(DeventCache);

	const devent: Devent | undefined = deventCache.getById(
		rule.events[0].deventId,
	);

	if (!devent) {
		return [];
	}

	const resultOfComparation: RuleResultEventComparation =
		await processEventSelector({
			rule,
			devent,
			device,
		});

	if (!resultOfComparation.wasTriggered) {
		loggerDebug(`${loggerAuxMessage} rule not triggered.`);

		return [];
	}

	if (rule?.notifications?.length) {
		const notificationData: DeviceNotificationSchema =
			notificationBuildByAlertList({
				deviceAlertToLaunchList: resultOfComparation.alertToLaunchList,
				device,
				rule,
			});

		await handleRuleNotification({
			notifications: rule.notifications,
			notificationData,
		});
	}

	return rule?.alerts?.length ? resultOfComparation.alertToLaunchList : [];
};
