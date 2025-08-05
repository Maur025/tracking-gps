import z, { enum as enum_ } from 'zod/v4';

export const GeofenceEventLoggerEventType = enum_(['IN', 'OUT']);

export type GeofenceEventLoggerEventType = z.infer<
	typeof GeofenceEventLoggerEventType
>;
