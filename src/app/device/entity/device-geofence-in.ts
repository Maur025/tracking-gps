import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import z, { array, number, object, string } from 'zod/v4';

export const DeviceGeofenceIn = object({
	geofenceList: array(GeofenceIn).default([]),
	geofenceInTotal: number().nonnegative().default(0),
	quantityNewIn: number().nonnegative().default(0),
	geofenceInNames: array(string()).default([]),
});

export type DeviceGeofenceIn = z.infer<typeof DeviceGeofenceIn>;
