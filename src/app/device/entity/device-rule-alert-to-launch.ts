import z, { boolean, object, string } from 'zod/v4';
import { DeviceRuleAlertToLaunchType } from './device-rule-alert-to-launch-type';

export const DeviceRuleAlertToLaunch = object({
	ruleGeofenceRegistryId: string().nonempty().optional(),
	ruleRegistryStatesId: string().nonempty().optional(),
	alertType: DeviceRuleAlertToLaunchType,
	alertId: string().nullable(),
	ruleId: string().nonempty(),
	isGeofenceIn: boolean().optional(),
	speed: string().optional(),
	fuel: string().optional(),
	battery: string().optional(),
	ignition: string().optional(),
});

export type DeviceRuleAlertToLaunch = z.infer<typeof DeviceRuleAlertToLaunch>;
