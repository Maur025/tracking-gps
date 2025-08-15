import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule';
import { loggerDebug } from '@maur025/core-logger';
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

	const resultOfComparation: boolean = false;

	if (rule.events?.length === 1) {
		// allways assess event of rule
		return;
	}

	const andEvents: Devent[] = [];
	const orEvents: Devent[] = [];

	for (const event of rule.events) {
		const devent: Devent | undefined = deventCache.getById(event.deventId);

		if (!devent) {
			continue;
		}

		if (devent.condition === 'AND') {
			andEvents.push(devent);

			continue;
		}

		orEvents.push(devent);
	}

	// resultOfComparation should be equal result other function, that processes the 2 arrays and returns booleans to finally make a comparison type and || or more or less

	if (resultOfComparation) {
		// logic to notification
	}
};
