import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const RuleGeofence = BaseData.extend({
	rule_id: string().nonempty(),
	geofence_id: string().nonempty(),
});

export type RuleGeofence = z.infer<typeof RuleGeofence>;
