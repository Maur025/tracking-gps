import { PositionL2 } from '@common/schema/position.schema';
import z, { object, uuid } from 'zod/v4';

export const RouteSection = object({
	uuid: uuid().nonempty().optional(),
	coords: PositionL2.optional(),
});

export type RouteSection = z.infer<typeof RouteSection>;
