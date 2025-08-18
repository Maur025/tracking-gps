import z, { enum as enum_ } from 'zod/v4';

export const DeviceRuleAlertToLaunchType = enum_(['GEOFENCE', 'STATE']);

export type DeviceRuleAlertToLaunchType = z.infer<
	typeof DeviceRuleAlertToLaunchType
>;
