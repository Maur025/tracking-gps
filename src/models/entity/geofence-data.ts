import { BaseData } from '@maur025/core-model-data';
import { GeofenceType } from '@models/types/geofence.type';
import { Coordinate } from 'ol/coordinate';

export default interface GeofenceData extends BaseData {
	internalId: string;
	uuid?: number;
	show?: boolean;
	over?: boolean;
	area?: number;
	radius?: number;
	type?: GeofenceType;
	coords?: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
	name?: string;
}
