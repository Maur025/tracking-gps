import { PositionSchema } from '@schemas/position.schema';
import { Coordinate } from 'ol/coordinate';
import { Polygon } from 'ol/geom.js';
import { fromLonLat } from 'ol/proj.js';

interface Request {
	coords: PositionSchema;
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
		}) ?? [],
	);
};
