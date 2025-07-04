import { Coordinate } from 'ol/coordinate';

/**
 * @deprecated GeofenceCoord is deprecated, use schema version
 */
export type GeofenceCoord =
	| Coordinate
	| Coordinate[]
	| Coordinate[][]
	| Coordinate[][][];
