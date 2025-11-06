import DeventCache from '@app/devent/cache/devent-cache.js';
import { Devent } from '@app/devent/entity/devent.js';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';
import { RuleResultEventComparison } from '@app/rule/dto/rule-result-event-comparison.js';
import { container } from 'tsyringe';
import { processEventSelector } from './process-event-selector.js';
import { loggerDebug } from '@maur025/core-logger';
import z, { object } from 'zod/v4';
import { Rule } from '@app/rule/entity/rule.js';
import { Device } from '@app/device/entity/device.js';
import { handleRuleNotification } from '@app/notification/service/handle-rule-notification.js';
import { notificationBuildByAlertList } from './notification-build-by-alert-list.js';
import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema.js';

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
		loggerDebug(`${loggerAuxMessage} devent not found in cache.`);
		return [];
	}

	const resultOfComparison: RuleResultEventComparison =
		await processEventSelector({
			rule,
			devent,
			device,
		});

	if (!resultOfComparison.wasTriggered) {
		loggerDebug(`${loggerAuxMessage} rule not triggered.`);

		return [];
	}

	if (rule?.notifications?.length) {
		const notificationData: DeviceNotificationSchema =
			notificationBuildByAlertList({
				deviceAlertToLaunchList: resultOfComparison.alertToLaunchList,
				device,
				rule,
			});

		await handleRuleNotification({
			notifications: rule.notifications,
			notificationData,
		});
	}

	return rule?.alerts?.length ? resultOfComparison.alertToLaunchList : [];
};
