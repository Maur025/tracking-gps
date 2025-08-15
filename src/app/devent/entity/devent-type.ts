import z, { enum as enum_ } from 'zod/v4';

export const DeventType = enum_(['GEOFENCES', 'INTEREST_POINTS', 'SENSORS']);

export type DeventType = z.infer<typeof DeventType>;
