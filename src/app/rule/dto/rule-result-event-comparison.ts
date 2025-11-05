import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import z, { array, boolean, object } from 'zod/v4';

export const RuleResultEventComparison = object({
	wasTriggered: boolean().default(false),
	alertToLaunchList: array(DeviceRuleAlertToLaunch).default([]),
});

export type RuleResultEventComparison = z.infer<
	typeof RuleResultEventComparison
>;
