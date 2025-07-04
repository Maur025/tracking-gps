import { BaseData } from '@maur025/core-model-data';
import { Vehicle } from './vehicle';

/**
 * @deprecated Group is deprecated, use schema version
 */
export interface Group extends BaseData {
	name: string;
	description: string;
	vehicles: Vehicle[];
}
