import z, { enum as enum_ } from 'zod/v4';

export const LayerType = enum_(['POLYGONS', 'POINTS_INTEREST', 'POINTS']);

export type LayerType = z.infer<typeof LayerType>;
