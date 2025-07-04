import { BaseData } from '@maur025/core-model-data';
import { GeofenceCoord } from '@models/types/geofence-coord';
import { GeofenceType } from '@models/types/geofence.type';

/**
 * @deprecated GeofenceData is deprecated, use schema version
 */
export default interface GeofenceData extends BaseData {
	internalId: string;
	uuid?: number;
	show?: boolean;
	over?: boolean;
	area?: number;
	radius?: number;
	type?: GeofenceType;
	coords?: GeofenceCoord;
	name?: string;
}
