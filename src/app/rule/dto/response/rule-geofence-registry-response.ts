import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';

export const RuleGeofenceRegistryResponse = BaseData.extend({
	rule_geofence_id: string().nonempty(),
	device_id: string().nonempty(),
	inout: number().nonnegative(),
	timestamp: number().nonnegative(),
	lat: number(),
	lon: number(),
});

export type RuleGeofenceRegistryResponse = z.infer<
	typeof RuleGeofenceRegistryResponse
>;
