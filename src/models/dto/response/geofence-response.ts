import { BaseData } from '@maur025/core-model-data';
import { GeofenceType } from '@models/types/geofence.type';

export default interface GeofenceResponse extends BaseData {
	data?: string;
	name?: string;
	type?: GeofenceType;
}
