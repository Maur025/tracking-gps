import { GeofenceCoord } from '@models/types/geofence-coord';
import { GeofenceType } from '@models/types/geofence.type';

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
	isInside?: boolean;
}
