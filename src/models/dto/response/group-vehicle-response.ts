import { BaseData } from '@maur025/core-model-data';
import { VehicleResponse } from './vehicle-response';

/**
 * @deprecated GroupVehicleResponse is deprecated, use schema version
 */
export interface GroupVehicleResponse extends BaseData {
	group_id: string;
	vehicle_id: string;
	vehicle: VehicleResponse;
}
