import z, { enum as enum_ } from 'zod/v4';

export const GeofenceCalculateStates = enum_(['NONE', 'IN', 'OUT', 'IN_OUT']);

export type GeofenceCalculateStates = z.infer<typeof GeofenceCalculateStates>;
