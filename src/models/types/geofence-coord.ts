import { Coordinate } from 'ol/coordinate';

export type GeofenceCoord =
	| Coordinate
	| Coordinate[]
	| Coordinate[][]
	| Coordinate[][][];
