import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule';
import { loggerDebug, loggerWarn } from '@maur025/core-logger';
import { container } from 'tsyringe';
import DeventCache from '@app/devent/cache/devent-cache';
import { Devent } from '@app/devent/entity/devent';
import { processGeofenceEvent } from './process-geofence-event';
import { processInterestPointEvent } from './process-interest-point-event';
import { processSensorEvent } from './process-sensor-event';
import { RuleResultEventComparation } from '../dto/rule-result-event-comparation';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';

const ProcessRuleRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessRuleRequest = z.infer<typeof ProcessRuleRequest>;

const loggerAuxMessage: string = `[RULE] (processRule)`;

export const processRule = async (
	request: ProcessRuleRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { rule, device } = ProcessRuleRequest.parse(request);

	if (!rule.events?.length) {
		loggerDebug(`${loggerAuxMessage} rule has no events.`);

		return [];
	}

	const deventCache = container.resolve(DeventCache);

	if (rule.events?.length === 1) {
		// allways assess event of rule
		const devent: Devent | undefined = deventCache.getById(
			rule.events[0].deventId,
		);

		if (!devent) {
			return [];
		}

		const resultOfComparation: RuleResultEventComparation = await processEvent({
			rule,
			devent,
			device,
		});

		if (!resultOfComparation.wasTriggered) {
			loggerDebug(`${loggerAuxMessage} rule not triggered.`);

			return [];
		}

		await pushNotifications();
		return resultOfComparation.alertToLaunchList;
	}

	const resultAndEvents: RuleResultEventComparation[] = [];
	const resultOrEvents: RuleResultEventComparation[] = [];

	for (const event of rule.events) {
		const devent: Devent | undefined = deventCache.getById(event.deventId);

		if (!devent) {
			continue;
		}

		if (devent.condition === 'AND') {
			resultAndEvents.push(await processEvent({ rule, devent, device }));

			continue;
		}

		resultOrEvents.push(await processEvent({ rule, devent, device }));
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

	pushNotifications();
	return [...andAlertLaunchList, ...orAlertLaunchList];
};

const ProcessEventRequest = object({
	device: Device,
	devent: Devent,
	rule: Rule,
});

type ProcessEventRequest = z.infer<typeof ProcessEventRequest>;

const processEvent = async (
	request: ProcessEventRequest,
): Promise<RuleResultEventComparation> => {
	const { devent, device, rule } = ProcessEventRequest.parse(request);

	switch (devent.deventType) {
		case 'GEOFENCES': {
			return processGeofenceEvent({ device, rule });
		}
		case 'INTEREST_POINTS': {
			return processInterestPointEvent();
		}
		case 'SENSORS': {
			return processSensorEvent();
		}
		default: {
			loggerWarn(`[RULE] (processEvent) devent type unknowned, skipping...`);

			return { alertToLaunchList: [], wasTriggered: false };
		}
	}
};

const pushNotifications = async (): Promise<void> => {};
