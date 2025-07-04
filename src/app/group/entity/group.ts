import { Vehicle } from '@app/vehicle/entity/vehicle';
import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';

export const Group = BaseData.extend({
	name: string().nonempty(),
	description: string().nonempty(),
	vehicles: array(Vehicle).default([]),
});

export type Group = z.infer<typeof Group>;
