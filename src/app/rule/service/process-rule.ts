import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule';
import { loggerDebug } from '@maur025/core-logger';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { handleSingleEvent } from './handle-event/handle-single-event';
import { handleMultiEvent } from './handle-event/handle-multi-event';

const ProcessRuleRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessRuleRequest = z.infer<typeof ProcessRuleRequest>;

const loggerAuxMessage: string = `[RULE] (processRule)`;

export const processRule = async (
	request: ProcessRuleRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	console.log(request);

	const { rule, device } = ProcessRuleRequest.parse(request);

	if (!rule.events?.length) {
		loggerDebug(`${loggerAuxMessage} rule has no events.`);

		return [];
	}

	if (rule.events?.length === 1) {
		return await handleSingleEvent({ rule, device });
	}

	return await handleMultiEvent({ device, rule });
};
