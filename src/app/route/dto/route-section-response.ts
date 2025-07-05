import { BaseData } from '@maur025/core-model-data';
import { PositionL2 } from '@common/schema/position.schema';
import z, { uuid } from 'zod/v4';

export const RouteSectionResponse = BaseData.extend({
	uuid: uuid().nonempty().optional(),
	coords: PositionL2.optional(),
});

export type RouteSectionResponse = z.infer<typeof RouteSectionResponse>;
