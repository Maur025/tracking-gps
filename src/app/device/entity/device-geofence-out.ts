import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import z, { array, number, object } from 'zod/v4';

export const DeviceGeofenceOut = object({
	geofenceList: array(GeofenceIn).default([]),
	geofenceOutTotal: number().nonnegative().default(0),
});

export type DeviceGeofenceOut = z.infer<typeof DeviceGeofenceOut>;
