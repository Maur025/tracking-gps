import { Device } from '@app/device/entity/device';
import { loggerDebug } from '@maur025/core-logger';
import { container } from 'tsyringe';
import z, { array, object, string } from 'zod/v4';
import RuleCache from '../cache/rule-cache';
import { Rule } from '../entity/rule';
import { getWeeklyDay } from '@utils/get-weekly-day';
import { getRuleFrequencyInDay } from './get-rule-frequency-in-day';
import { isRuleFrequencyBetweenAvailableHours } from './is-rule-frequency-between-available-hours';
import { processRule } from './process-rule';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';

const ProcessRulesByDeviceRequest = object({
	device: Device,
	rulesToApply: array(string()).default([]),
});

type ProcessRulesByDeviceRequest = z.infer<typeof ProcessRulesByDeviceRequest>;

const loggerAuxMessage: string = `[RULE] (processRulesByDevice)`;

export const processRulesByDevice = async (
	request: ProcessRulesByDeviceRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { device, rulesToApply } = ProcessRulesByDeviceRequest.parse(request);

	if (!rulesToApply.length) {
		loggerDebug(`${loggerAuxMessage} no rules to apply.`);

		return [];
	}

	const ruleCache = container.resolve(RuleCache);
	let deviceRuleAlertToLaunchList: DeviceRuleAlertToLaunch[] = [];

	const weeklyDay = getWeeklyDay();
	const ruleInFrequencyApplyList: Rule[] = [];

	for (const ruleId of rulesToApply) {
		const rule: Rule | undefined = ruleCache.getById(ruleId);

		if (!rule) {
			loggerDebug(`${loggerAuxMessage} rule not founded [${ruleId}`);

			continue;
		}

		if (!rule?.frequencies?.length) {
			loggerDebug(`${loggerAuxMessage} rule has no frequencies.`);

			continue;
		}

		const shouldApplyRule = rule.frequencies.some(
			frequency =>
				weeklyDay === getRuleFrequencyInDay(frequency.frequency) &&
				isRuleFrequencyBetweenAvailableHours({ frequency }),
		);

		if (shouldApplyRule) {
			ruleInFrequencyApplyList.push(rule);
		}
	}

	if (!ruleInFrequencyApplyList.length) {
		loggerDebug(`${loggerAuxMessage} no rules in frequency to apply.`);
		return [];
	}

	for (const rule of ruleInFrequencyApplyList) {
		const alertToLaunchList: DeviceRuleAlertToLaunch[] = await processRule({
			device,
			rule: { ...rule, deleted: !!rule?.deleted },
		});

		deviceRuleAlertToLaunchList = [
			...deviceRuleAlertToLaunchList,
			...alertToLaunchList,
		];
	}

	loggerDebug(
		`${loggerAuxMessage} rules processed, total alerts to launch: ${deviceRuleAlertToLaunchList.length}`,
	);
	return deviceRuleAlertToLaunchList;
};
