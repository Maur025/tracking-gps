import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const VehicleMetadata = BaseData.extend({
	plaque: string().nonempty().optional(),
	brand: string().nonempty().optional(),
	model: string().nonempty().optional(),
	color: string().nonempty().optional(),
	totalTour: string().nonempty().optional(),
	totalFuel: string().nonempty().optional(),
	fuelKilometer: string().nonempty().optional(),
	detail: string().optional(),
});

export type VehicleMetadata = z.infer<typeof VehicleMetadata>;
