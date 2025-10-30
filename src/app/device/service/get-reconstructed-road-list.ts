import { Feature, GeoJsonProperties, LineString, Position } from 'geojson';
import { along as turfAlong } from '@turf/turf';

export const getReconstructedRoadCoordsList = (
	lineString: Feature<LineString, GeoJsonProperties>,
	lineLength: number,
): Position[] => {
	const reconstructedRoadList: Position[] = [];

	const lineLengthSafe = Math.max(Math.floor(lineLength), 1);

	let distanceTraveled = 0;
	while (distanceTraveled <= lineLengthSafe) {
		const generatedPoint = turfAlong(lineString, distanceTraveled, {
			units: 'meters',
		});

		reconstructedRoadList.push(generatedPoint.geometry.coordinates);

		distanceTraveled += 1;
	}

	return reconstructedRoadList;
};
