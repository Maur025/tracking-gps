import { BaseData } from '@maur025/core-model-data';
import { GeofenceType } from '@models/types/geofence.type';
import GeofenceData from './geofence-data';
/**
 * @deprecated
 * Geofence interface is deprecated ... use schema zod version
 */
export default interface Geofence extends BaseData {
	data?: GeofenceData[];
	name?: string;
	type?: GeofenceType;
}
