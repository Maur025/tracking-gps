import { BaseData } from '@maur025/core-model-data';
import { Coord, MultiCoordPath } from '@models/types/coord.type';
import { GeofenceType } from '@models/types/geofence.type';

export default interface GeofenceDataResponse extends BaseData {
	uuid?: number;
	show?: boolean;
	over?: boolean;
	area?: number;
	radius?: number;
	type?: GeofenceType;
	coords?: MultiCoordPath | Coord;
}
