import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const VehicleDeviceResponse = BaseData.extend({
	vehicle_id: string().nonempty().optional(),
	device_id: string().nonempty().optional(),
});

export type VehicleDeviceResponse = z.infer<typeof VehicleDeviceResponse>;
