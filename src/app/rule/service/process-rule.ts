import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule';
import { loggerDebug, loggerWarn } from '@maur025/core-logger';
import { container } from 'tsyringe';
import DeventCache from '@app/devent/cache/devent-cache';
import { Devent } from '@app/devent/entity/devent';

const ProcessRuleRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessRuleRequest = z.infer<typeof ProcessRuleRequest>;

const loggerAuxMessage: string = `[RULE] (processRule)`;

export const processRule = async (
	request: ProcessRuleRequest,
): Promise<void> => {
	const { rule } = ProcessRuleRequest.parse(request);

	if (!rule.events?.length) {
		loggerDebug(`${loggerAuxMessage} rule has no events.`);

		return;
	}

	const deventCache = container.resolve(DeventCache);

	if (rule.events?.length === 1) {
		// allways assess event of rule
		const devent: Devent | undefined = deventCache.getById(
			rule.events[0].deventId,
		);

		if (!devent) {
			return;
		}

		const resultOfComparation: boolean = processEvent(devent);

		if (resultOfComparation) {
			await pushNotifications();
		}

		return;
	}

	const resultAndEvents: boolean[] = [];
	const resultOrEvents: boolean[] = [];

	for (const event of rule.events) {
		const devent: Devent | undefined = deventCache.getById(event.deventId);

		if (!devent) {
			continue;
		}

		if (devent.condition === 'AND') {
			resultAndEvents.push(processEvent(devent));

			continue;
		}

		resultOrEvents.push(processEvent(devent));
	}

	const resultOfComparation: boolean =
		resultAndEvents.every(value => value) &&
		resultOrEvents.some(value => value);

	if (resultOfComparation) {
		pushNotifications();
	}
};

const processEvent = (devent: Devent): boolean => {
	switch (devent.deventType) {
		case 'GEOFENCES': {
			return false;
		}
		case 'INTEREST_POINTS': {
			return false;
		}
		case 'SENSORS': {
			return true;
		}
		default: {
			loggerWarn(`[RULE] (processEvent) devent type unknowned, skipping...`);
			return false;
		}
	}
};

const pushNotifications = async (): Promise<void> => {};
