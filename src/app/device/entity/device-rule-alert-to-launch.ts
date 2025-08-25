import z, { boolean, number, object, string } from 'zod/v4';
import { DeviceRuleAlertToLaunchType } from './device-rule-alert-to-launch-type';

export const DeviceRuleAlertToLaunch = object({
	ruleGeofenceRegistryId: string().nonempty().optional(),
	ruleRegistryStatesId: string().nonempty().optional(),
	alertId: string().nullable(),
	ruleId: string().nonempty(),
	deviceId: string().nonempty().optional(),
	geofenceId: string().nonempty().optional(),
	alertType: DeviceRuleAlertToLaunchType,
	isGeofenceIn: boolean().optional(),
	speed: string().optional(),
	fuel: string().optional(),
	battery: string().optional(),
	ignition: string().optional(),
	timestamp: number().nonnegative().optional(),
	lat: number().min(-90).max(90).optional(),
	lon: number().min(-180).max(180).optional(),
});

export type DeviceRuleAlertToLaunch = z.infer<typeof DeviceRuleAlertToLaunch>;
