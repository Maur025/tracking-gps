import { Track } from '@app/track/entity/track.js';
import z, { object, string } from 'zod/v4';
import { bearing, distance as turfDistance } from '@turf/turf';
import {
	DeviceMovingDirection,
	DirectionEnum,
} from '../entity/device-moving-direction.js';
import { Position } from 'geojson';
import { loggerDebug } from '@maur025/core-logger';

const CalculateGpsDirectionRequest = object({
	deviceId: string(),
	previousTrack: Track.optional(),
	track: Track.optional(),
	previousDeviceMovingDirection: DeviceMovingDirection.optional(),
});

type CalculateGpsDirectionRequest = z.infer<
	typeof CalculateGpsDirectionRequest
>;

export const calculateGpsDirection = (
	request: CalculateGpsDirectionRequest,
): DeviceMovingDirection => {
	const { previousTrack, track, previousDeviceMovingDirection } =
		CalculateGpsDirectionRequest.parse(request);

	const { lat: currentLat = 0, lon: currentLon = 0 } = track ?? {};
	const { lat: previousLat = 0, lon: previousLon = 0 } = previousTrack ?? {};

	const coords = [currentLon, currentLat];
	const previousCoords = [previousLon, previousLat];

	const isMoving: boolean = isValidMovement(coords, previousCoords);

	const bearingOfTwoPoints = bearing(previousCoords, coords);

	const previousDirectionInGrades =
		previousDeviceMovingDirection?.directionInGrades !== undefined
			? previousDeviceMovingDirection.directionInGrades
			: undefined;

	const directionInGrades = isMoving
		? bearingOfTwoPoints
		: previousDirectionInGrades;

	loggerDebug(
		`[DIRECTION] (calculateGpsDirection) Calculated directionInGrades successfully`,
	);

	return {
		direction: getDirectionEnumFromGrades(directionInGrades),
		directionInGrades,
		previousDirection: previousDeviceMovingDirection?.direction ?? 'UNKNOWN',
		previousDirectionInGrades,
		differenceInGrades: getDifferenceBetweenGrades(
			directionInGrades,
			previousDirectionInGrades,
		),
		isStay: !isMoving,
	};
};

const isValidMovement = (
	coords: Position,
	previousCoords: Position,
): boolean => {
	const distanceBetweenPoints = turfDistance(coords, previousCoords);
	return distanceBetweenPoints > 0;
};

const getDirectionEnumFromGrades = (
	grades: number | undefined,
): DirectionEnum => {
	if (grades === undefined) return 'UNKNOWN';
	if (grades === 0) return 'N';
	if (grades === 90) return 'E';
	if (grades === 180 || grades === -180) return 'S';
	if (grades === -90) return 'O';
	if (grades > 0 && grades < 90) return 'NE';
	if (grades > 90 && grades < 180) return 'SE';
	if (grades < 0 && grades > -90) return 'NO';
	if (grades < -90 && grades > -180) return 'SO';
	return 'UNKNOWN';
};

const normalizeBearing = (bearing: number) => {
	const normalized = ((((bearing + 180) % 360) + 360) % 360) - 180;
	return normalized;
};

const getDifferenceBetweenGrades = (
	direction: number | undefined,
	previousDirection: number | undefined,
) => {
	if (direction === undefined || previousDirection === undefined) {
		loggerDebug(
			`[DIRECTION] (getDifferenceBetweenGrades) direction or previousDirection is undefined, skipping...`,
		);

		return undefined;
	}
	const directionNormalized = normalizeBearing(direction);
	const previousDirectionNormalized = normalizeBearing(previousDirection);

	let differenceInGrades = directionNormalized - previousDirectionNormalized;

	if (differenceInGrades > 180) {
		differenceInGrades -= 360;
	}

	if (differenceInGrades < -180) {
		differenceInGrades += 360;
	}

	return differenceInGrades;
};
