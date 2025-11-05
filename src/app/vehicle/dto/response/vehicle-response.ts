import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';
import { VehicleDeviceResponse } from './vehicle-device-response.js';

export const VehicleResponse = BaseData.extend({
	name: string().nonempty(),
	type: string().nonempty(),
	metadata: string().nonempty(),
	device: array(VehicleDeviceResponse).optional().default([]),
});

export type VehicleResponse = z.infer<typeof VehicleResponse>;
