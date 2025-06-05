import { BaseData } from '@maur025/core-model-data';

export interface GroupResponse extends BaseData {
	name?: string;
	description?: string;
	vehicles: [];
}
