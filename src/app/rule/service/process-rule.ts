import { Device } from '@app/device/entity/device.js';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule.js';
import { loggerDebug } from '@maur025/core-logger';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';
import { handleSingleEvent } from './handle-event/handle-single-event.js';
import { handleMultiEvent } from './handle-event/handle-multi-event.js';

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

	if (rule.events?.length === 1) {
		loggerDebug(`${loggerAuxMessage} handling single event.`);
		return await handleSingleEvent({ rule, device });
	}

	loggerDebug(`${loggerAuxMessage} handling multi event.`);
	return await handleMultiEvent({ device, rule });
};
