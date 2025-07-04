import { BaseData } from '@maur025/core-model-data';
import z, { boolean, string } from 'zod/v4';
import { GeofenceData } from './geofence-data';

export const GeofenceIn = BaseData.extend({
	deviceId: string().nonempty(),
	geofenceId: string().nonempty(),
	geofenceName: string().nonempty(),
	section: GeofenceData,
	isInside: boolean().default(false).optional(),
	date: string().nonempty().optional(),
});

export type GeofenceIn = z.infer<typeof GeofenceIn>;
