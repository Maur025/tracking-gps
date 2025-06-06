import { BaseData } from '@maur025/core-model-data';
import { Vehicle } from './vehicle';

export interface Group extends BaseData {
	name: string;
	description: string;
	vehicles: Vehicle[];
}
