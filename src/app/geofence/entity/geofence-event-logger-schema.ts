import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';
import { GeofenceEventLoggerEventType } from './geofence-event-logger-event-type.js';

export const GeofenceEventLoggerSchema = BaseData.extend({
	geofence_id: string().nonempty(),
	device_id: string().nonempty(),
	layer_id: string().nonempty(),
	device_lat: number(),
	device_lon: number(),
	timestamp: number().nonnegative(),
	event_type: GeofenceEventLoggerEventType,
});

export type GeofenceEventLoggerSchema = z.infer<
	typeof GeofenceEventLoggerSchema
>;
