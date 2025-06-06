import { BaseData } from '@maur025/core-model-data';
import { VehicleResponse } from './vehicle-response';

export interface GroupVehicleResponse extends BaseData {
	group_id: string;
	vehicle_id: string;
	vehicle: VehicleResponse;
}
