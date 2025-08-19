import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';
import { GroupVehicleResponse } from './group-vehicle-response';

export const GroupResponse = BaseData.extend({
	name: string().nonempty().optional(),
	description: string().nonempty().optional(),
	vehicles: array(GroupVehicleResponse).default([]).optional(),
});

export type GroupResponse = z.infer<typeof GroupResponse>;
