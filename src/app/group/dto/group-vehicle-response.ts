import { VehicleResponse } from '@app/vehicle/dto/vehicle-response';
import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const GroupVehicleResponse = BaseData.extend({
	group_id: string().nonempty(),
	vehicle_id: string().nonempty(),
	vehicle: VehicleResponse,
});

export type GroupVehicleResponse = z.infer<typeof GroupVehicleResponse>;
