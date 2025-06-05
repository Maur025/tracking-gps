import { BaseData } from '@maur025/core-model-data';

export interface VehicleResponse extends BaseData {
	name: string;
	type: string;
	metadata: string;
}
