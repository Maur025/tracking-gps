import { getTotalSecondsElapsedSincePreviousTimestamp } from '@app/device/service/get-total-elapsed-since-previous-timestamp';
import { Feature, GeoJsonProperties, Point, Position } from 'geojson';
import z, { array, number, object } from 'zod/v4';
import {
	lineString as turfLineString,
	length as turfLength,
	along as turfAlong,
	distance as turfDistance,
	destination,
} from '@turf/turf';
import { loggerDebug } from '@maur025/core-logger';
import { DeviceMovingDirection } from '@app/device/entity/device-moving-direction';

const RebuildRouteBetweenTwoPointsRequest = object({
	coords: array(number()),
	previousCoords: array(number()),
	previousTimestamp: number().nonnegative(),
	timestamp: number().nonnegative(),
	movingDirection: DeviceMovingDirection,
});

type RebuildRouteBetweenTwoPointsRequest = Omit<
	z.infer<typeof RebuildRouteBetweenTwoPointsRequest>,
	'coords' | 'previousCoords'
> & {
	coords: Position;
	previousCoords: Position;
};

export const rebuildRouteBetweenTwoPoints = (
	request: RebuildRouteBetweenTwoPointsRequest,
): Feature<Point, GeoJsonProperties>[] => {
	const {
		coords,
		previousCoords,
		previousTimestamp,
		timestamp,
		movingDirection,
	} = RebuildRouteBetweenTwoPointsRequest.parse(request);
	const pointsOfRoute: Feature<Point, GeoJsonProperties>[] = [];

	const distanceBetweenStartAndEnd = turfDistance(previousCoords, coords, {
		units: 'meters',
	});

	loggerDebug(
		`distance between previous and current point: ${distanceBetweenStartAndEnd} meters.`,
	);

	if (
		movingDirection.directionInGrades &&
		movingDirection.previousDirectionInGrades &&
		movingDirection.differenceInGrades
	) {
		loggerDebug(
			`moving direction in grades: ${movingDirection.directionInGrades}.`,
		);

		const steps = 15;

		const tentativePoints = [];
		for (let i = 0; i <= steps; i++) {
			const progress = i / steps;
			let deltaGrades = movingDirection.differenceInGrades;

			if (
				movingDirection.previousDirectionInGrades > 0 &&
				movingDirection.directionInGrades < 0
			) {
				deltaGrades *= -1;
			}

			if (
				movingDirection.previousDirectionInGrades < 0 &&
				movingDirection.directionInGrades > 0
			) {
				deltaGrades *= -1;
			}

			const bearing =
				movingDirection.previousDirectionInGrades + progress * deltaGrades;
			const newPoint = destination(
				previousCoords,
				distanceBetweenStartAndEnd * progress,
				bearing,
				{ units: 'meters' },
			);

			tentativePoints.push(newPoint.geometry.coordinates);
		}
		// const point = destination(
		// 	previousCoords,
		// 	distanceBetweenStartAndEnd / 2,
		// 	movingDirection.directionInGrades -
		// 		movingDirection.previousDirectionInGrades,
		// 	{ units: 'meters' },
		// );
		console.log([previousCoords, ...tentativePoints, coords]);
	}

	const timeElapsedSincePreviousTrack =
		getTotalSecondsElapsedSincePreviousTimestamp(timestamp, previousTimestamp);

	const numberOfSecondsToDivide = getNumberOfSecondsToDivide(
		timeElapsedSincePreviousTrack,
	);

	const quantityOfPointsToGenerate = Math.floor(
		timeElapsedSincePreviousTrack / numberOfSecondsToDivide,
	);

	const routeBetweenPoints = turfLineString([previousCoords, coords]);
	const distanceRouteBetweenPoints = turfLength(routeBetweenPoints, {
		units: 'meters',
	});

	const distanceBetweenPoints =
		distanceRouteBetweenPoints / quantityOfPointsToGenerate;

	let distanceToAlong = 0;
	while (distanceToAlong <= distanceRouteBetweenPoints) {
		const pointAlong = turfAlong(routeBetweenPoints, distanceToAlong, {
			units: 'meters',
		});

		pointsOfRoute.push(pointAlong);

		distanceToAlong += distanceBetweenPoints;
	}

	return pointsOfRoute;
};

const getNumberOfSecondsToDivide = (timeInSeconds: number) => {
	if (timeInSeconds <= 60) {
		return 2;
	}

	const minutes = Math.floor(timeInSeconds / 60);
	return minutes + 2;
};
