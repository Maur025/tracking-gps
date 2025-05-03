import { GeofenceCoord } from '@models/types/geofence-coord';
import { Coordinate } from 'ol/coordinate';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

interface Request {
	coords: GeofenceCoord;
}

export const getPolygonByCoords = ({ coords }: Request): Polygon => {
	return new Polygon(
		coords?.map(coord => {
			if (Array.isArray(coord)) {
				return coord.map(coordinate => {
					if (typeof coordinate == 'object') {
						return fromLonLat(coordinate as Coordinate);
					}

					return [];
				});
			}

			return [];
		}) ?? []
	);
};
