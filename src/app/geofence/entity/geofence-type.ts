import z, { enum as enum_ } from 'zod/v4';

export const GeofenceType = enum_(['POLYGONS', 'POINTS']);

export type GeofenceType = z.infer<typeof GeofenceType>;
