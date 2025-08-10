import { BaseData } from '@maur025/core-model-data';
import { z, string } from 'zod/v4';

export const RuleVehicle = BaseData.extend({
	rule_id: string().nonempty(),
	vehicle_id: string().nonempty(),
});

export type RuleVehicle = z.infer<typeof RuleVehicle>;
