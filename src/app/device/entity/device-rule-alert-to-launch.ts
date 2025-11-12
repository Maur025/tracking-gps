import z, { boolean, number, object, string } from 'zod/v4';
import { DeviceRuleAlertToLaunchType } from './device-rule-alert-to-launch-type.js';

export const DeviceRuleAlertToLaunch = object({
	alertId: string().nullable(),
	ruleId: string().nonempty(),
	alertType: DeviceRuleAlertToLaunchType,
	ruleGeofenceRegistryId: string().nonempty().optional(),
	ruleRegistryStatesId: string().nonempty().optional(),
	deviceId: string().nonempty().optional(),
	geofenceId: string().nonempty().optional(),
	isGeofenceIn: boolean().optional(),
	timestamp: number().nonnegative().optional(),
	lat: number().min(-90).max(90).optional(),
	lon: number().min(-180).max(180).optional(),
	sensorName: string().nonempty().optional(),
	sensorValue: string().nonempty().optional(),
	ruleGeofenceId: string().nonempty().optional(),
	ruleDeventId: string().nonempty().optional(),
	sensorId: number().optional(),
});

export type DeviceRuleAlertToLaunch = z.infer<typeof DeviceRuleAlertToLaunch>;
