import DeventCache from '@app/devent/cache/devent-cache';
import { Devent } from '@app/devent/entity/devent';
import { Device } from '@app/device/entity/device';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { RuleResultEventComparation } from '@app/rule/dto/rule-result-event-comparation';
import { Rule } from '@app/rule/entity/rule';
import { container } from 'tsyringe';
import z, { object } from 'zod/v4';
import { processEventSelector } from './process-event-selector';
import { loggerDebug } from '@maur025/core-logger';
import { handleRuleNotification } from '@app/notification/service/handle-rule-notification';
import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';
import { notificationBuildByAlertList } from './notification-build-by-alert-list';

const loggerAuxMessage: string = `[RULE] (handleMultiEvent)`;

const HandleMultiEventRequest = object({
	rule: Rule,
	device: Device,
});

type HandleMultiEventRequest = z.infer<typeof HandleMultiEventRequest>;

export const handleMultiEvent = async (
	request: HandleMultiEventRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { rule, device } = HandleMultiEventRequest.parse(request);

	const deventCache = container.resolve(DeventCache);

	const resultAndEvents: RuleResultEventComparation[] = [];
	const resultOrEvents: RuleResultEventComparation[] = [];

	for (const event of rule.events) {
		const devent: Devent | undefined = deventCache.getById(event.deventId);

		if (!devent) {
			continue;
		}

		if (devent.condition === 'AND') {
			resultAndEvents.push(
				await processEventSelector({ rule, devent, device }),
			);

			continue;
		}

		resultOrEvents.push(await processEventSelector({ rule, devent, device }));
	}

	const resultOfComparation: boolean =
		resultAndEvents.every(value => value.wasTriggered) &&
		resultOrEvents.some(value => value.wasTriggered);

	if (!resultOfComparation) {
		loggerDebug(`${loggerAuxMessage} rule not triggered.`);
		return [];
	}

	const andAlertLaunchList: DeviceRuleAlertToLaunch[] = resultAndEvents.flatMap(
		andEvent => andEvent.alertToLaunchList,
	);

	const orAlertLaunchList: DeviceRuleAlertToLaunch[] = resultOrEvents.flatMap(
		orEvent => orEvent.alertToLaunchList,
	);

	const allAlertLaunchList: DeviceRuleAlertToLaunch[] = [
		...andAlertLaunchList,
		...orAlertLaunchList,
	];

	if (rule?.notifications?.length) {
		const notificationData: DeviceNotificationSchema =
			notificationBuildByAlertList({
				deviceAlertToLaunchList: allAlertLaunchList,
				device,
				rule,
			});

		await handleRuleNotification({
			notifications: rule.notifications,
			notificationData,
		});
	}

	return rule?.alerts?.length ? allAlertLaunchList : [];
};
