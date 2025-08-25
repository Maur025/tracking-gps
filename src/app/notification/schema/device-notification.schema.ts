import z, { array, object, string } from 'zod/v4';

export const DeviceNotificationSchema = object({
	deviceId: string().nonempty(),
	ruleId: string().nonempty(),
	vehicleId: string(),
	ruleDescription: string(),
	ruleName: string().nonempty(),
	vehicleName: string(),
	vehiclePlaca: string(),
	groupNames: string(),
	withSpeed: string(),
	withFuel: string(),
	withGeofenceIn: string(),
	withGeofenceOut: string(),
	withBattery: string(),
	withIgnition: string(),
	withInOut: string(),
	withLat: string(),
	withLon: string(),
	withTimestamp: string(),
	ruleGeofenceRegistryIds: array(string()).default([]),
	ruleRegistryStates: array(string()).default([]),
});

export type DeviceNotificationSchema = z.infer<typeof DeviceNotificationSchema>;
