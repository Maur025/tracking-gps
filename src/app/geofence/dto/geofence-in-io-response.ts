import z, { array, boolean, object, string } from 'zod/v4';
import { GeofenceIoResponse } from './geofence-io-response';

export const GeofenceInIoResponse = object({
	deviceId: string().nonempty(),
	geofences: array(GeofenceIoResponse).default([]),
	isInside: boolean().default(false),
});

export type GeofenceInIoResponse = z.infer<typeof GeofenceInIoResponse>;
