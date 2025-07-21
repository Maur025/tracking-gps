import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { VehicleMetadata } from './vehicle-metadata';

export const Vehicle = BaseData.extend({
	name: string().nonempty(),
	type: string().nonempty(),
	metadata: VehicleMetadata,
	deviceId: string().nonempty().optional(),
});

export type Vehicle = z.infer<typeof Vehicle>;
