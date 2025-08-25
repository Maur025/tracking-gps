import z, { number, object, string } from 'zod/v4';

export const RuleGeofenceRegistryCreateRequest = object({
	rule_geofence_id: string().nonempty(),
	device_id: string().nonempty(),
	geofence_id: string().nonempty(),
	inout: number().nonnegative(),
	timestamp: number().nonnegative(),
	lat: number(),
	lon: number(),
});

export type RuleGeofenceRegistryCreateRequest = z.infer<
	typeof RuleGeofenceRegistryCreateRequest
>;
