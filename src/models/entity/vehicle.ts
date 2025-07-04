import { BaseData } from '@maur025/core-model-data';
import { VehicleMetadata } from './vehicle-metadata';

/**
 * @deprecated Vehicle is deprecated, use schema version
 */
export interface Vehicle extends BaseData {
	name: string;
	type: string;
	metadata: VehicleMetadata;
}
