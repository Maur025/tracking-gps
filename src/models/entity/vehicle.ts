import { BaseData } from '@maur025/core-model-data';
import { VehicleMetadata } from './vehicle-metadata';

export interface Vehicle extends BaseData {
	name: string;
	type: string;
	metadata: VehicleMetadata;
}
