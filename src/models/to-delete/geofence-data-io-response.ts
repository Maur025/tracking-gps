import { GeofenceCoord } from '@models/types/geofence-coord';
import { GeofenceType } from '@models/types/geofence.type';

/**
 * @deprecated GeofenceDataIoResponse is deprecated, use schema version
 */
export default interface GeofenceDataIoResponse {
	internalId: string;
	uuid?: number;
	show?: boolean;
	over?: boolean;
	area?: number;
	radius?: number;
	type?: GeofenceType;
	coords?: GeofenceCoord;
	name?: string;
	date?: string;
}
