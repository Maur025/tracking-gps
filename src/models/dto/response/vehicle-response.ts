import { BaseData } from '@maur025/core-model-data';

/**
 * @deprecated VehicleResponse is deprecated, use schema version
 */
export interface VehicleResponse extends BaseData {
	name: string;
	type: string;
	metadata: string;
}
