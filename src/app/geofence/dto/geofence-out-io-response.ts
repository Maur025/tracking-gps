import z, { array, boolean, object, string } from 'zod/v4';
import { GeofenceIoResponse } from './geofence-io-response';

export const GeofenceOutIoResponse = object({
	deviceId: string().nonempty(),
	geofences: array(GeofenceIoResponse).default([]),
	isInside: boolean().default(false),
});

export type GeofenceOutIoResponse = z.infer<typeof GeofenceOutIoResponse>;
