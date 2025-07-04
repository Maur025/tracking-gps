import { BaseData } from '@maur025/core-model-data';
import { GroupVehicleResponse } from './group-vehicle-response';

/**
 * @deprecated GroupResponse is deprecated, use schema version
 */
export interface GroupResponse extends BaseData {
	name?: string;
	description?: string;
	vehicles: GroupVehicleResponse[];
}
