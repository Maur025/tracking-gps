import z, { array, object, string } from 'zod/v4';
import { GeofenceDataIoResponse } from './geofence-data-io-response';

export const GeofenceIoResponse = object({
	geofenceId: string().nonempty(),
	geofenceName: string().nonempty(),
	sections: array(GeofenceDataIoResponse).default([]),
});

export type GeofenceIoResponse = z.infer<typeof GeofenceIoResponse>;
