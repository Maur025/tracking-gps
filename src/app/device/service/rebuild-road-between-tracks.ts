import z, { object, string } from 'zod/v4';
import {
	DeviceReconstructedRoad,
	ReconstructedRoadTypeEnum,
} from '../entity/device-reconstructed-road';
import { Track } from '@app/track/entity/track';
import { loggerDebug } from '@maur025/core-logger';
import {
	Feature,
	GeoJsonProperties,
	LineString,
	Point,
	Position,
} from 'geojson';
import { DeviceMovingDirection } from '../entity/device-moving-direction';
import { getTotalSecondsElapsedSincePreviousTimestamp } from './get-total-elapsed-since-previous-timestamp';
import { StatusOfRebuildRoadEnum } from '../entity/device-reconstructed-road';
import environment from '@config/env';
import {
	distance as turfDistance,
	lineString as turfLineString,
	length as turfLength,
	along as turfAlong,
} from '@turf/turf';

const { MAX_METERS_PER_SECOND } = environment;

const RebuildRoadBetweenTracksRequest = object({
	deviceId: string().optional(),
	previousTrack: Track.optional(),
	currentTrack: Track.optional(),
	movingDirection: DeviceMovingDirection,
});

type RebuildRoadBetweenTracksRequest = z.infer<
	typeof RebuildRoadBetweenTracksRequest
>;

const loggerAuxData = `[REBUILD-ROAD] (rebuildRoadBetweenTracks)`;

export const rebuildRoadBetweenTracks = async (
	request: RebuildRoadBetweenTracksRequest,
): Promise<DeviceReconstructedRoad> => {
	const { deviceId, previousTrack, currentTrack, movingDirection } =
		RebuildRoadBetweenTracksRequest.parse(request);

	const previousCoords = getLonAndLatFromTrack(previousTrack);
	const currentCoords = getLonAndLatFromTrack(currentTrack);
	const timeElapsedSincePreviousTrack =
		getTotalSecondsElapsedSincePreviousTimestamp(
			currentTrack?.t ?? 0,
			previousTrack?.t ?? 0,
		);

	const resultValidation = validationDevice(
		deviceId,
		previousCoords,
		currentCoords,
		timeElapsedSincePreviousTrack,
	);

	if (resultValidation) {
		return resultValidation;
	}

	if (!previousCoords[0] && !previousCoords[1]) {
		loggerDebug(
			`${loggerAuxData} Previous coordinates are invalid, using current position only.`,
		);
		return buildDeviceReconstructedRoadResponse(
			'REBUILD_SUCCESS',
			[currentCoords],
			'Point',
			1,
		);
	}

	const distanceBetweenPointsInMeters = turfDistance(
		previousCoords,
		currentCoords,
		{ units: 'meters' },
	);

	const distanceTraveledEachSecond =
		distanceBetweenPointsInMeters / timeElapsedSincePreviousTrack;

	const numberOfSecondsToDivide = getNumberOfSecondsToDivide(
		timeElapsedSincePreviousTrack,
	);
	const quantityOfPointsToGenerate = Math.floor(
		timeElapsedSincePreviousTrack / numberOfSecondsToDivide,
	);

	let reconstructedRoadFlatLine: Feature<LineString, GeoJsonProperties>;

	if (
		distanceTraveledEachSecond > MAX_METERS_PER_SECOND ||
		(movingDirection.differenceInGrades !== undefined &&
			movingDirection.differenceInGrades < 10 &&
			movingDirection.differenceInGrades > -10)
	) {
		reconstructedRoadFlatLine = turfLineString([previousCoords, currentCoords]);
	} else {
		// add ... get complex rebuild
		reconstructedRoadFlatLine = turfLineString([previousCoords, currentCoords]);
	}

	const reconstructedRoadFlatLength = turfLength(reconstructedRoadFlatLine, {
		units: 'meters',
	});

	const distanceBetweenPoints =
		reconstructedRoadFlatLength / quantityOfPointsToGenerate;

	const reconstructedRoute: Position[] = [];

	let distanceTraveled = 0;
	while (distanceTraveled <= reconstructedRoadFlatLength) {
		const generatedPoint = turfAlong(
			reconstructedRoadFlatLine,
			distanceTraveled,
			{
				units: 'meters',
			},
		);

		reconstructedRoute.push(generatedPoint.geometry.coordinates);

		distanceTraveled += distanceBetweenPoints;
	}

	return buildDeviceReconstructedRoadResponse(
		'REBUILD_SUCCESS',
		reconstructedRoute,
		'LineString',
	);
};

const getLonAndLatFromTrack = (track: Track | undefined): Position => {
	if (!track) {
		return [0, 0];
	}

	return [track.lon ?? 0, track.lat ?? 0];
};

const validationDevice = (
	deviceId: string | undefined,
	previousCoords: Position,
	currentCoords: Position,
	timeElapsedSincePreviousTrack: number,
): DeviceReconstructedRoad | undefined => {
	if (!deviceId) {
		loggerDebug(
			`${loggerAuxData} Device ID is undefined. Skipping rebuild road between tracks.`,
		);

		return buildDeviceReconstructedRoadResponse('DEVICE_ID_MISSING');
	}

	if (
		!previousCoords[0] &&
		!previousCoords[1] &&
		!currentCoords[0] &&
		!currentCoords[1]
	) {
		loggerDebug(
			`${loggerAuxData} Device ID ${deviceId} previous and current coordinates are invalid. Skipping rebuild road between tracks.`,
		);

		return buildDeviceReconstructedRoadResponse('ALL_POSITIONS_INVALID');
	}

	if (timeElapsedSincePreviousTrack <= 0) {
		loggerDebug(
			` ${loggerAuxData} Device ID ${deviceId} time elapsed since previous track is less than or equal to zero. Skipping rebuild road between tracks.`,
		);

		return buildDeviceReconstructedRoadResponse('TIME_ELAPSED_INVALID');
	}

	if (
		previousCoords[0] === currentCoords[0] &&
		previousCoords[1] === currentCoords[1]
	) {
		loggerDebug(
			`${loggerAuxData} Device ID ${deviceId} coordinates did not change. Skipping rebuild road between tracks.`,
		);

		return buildDeviceReconstructedRoadResponse('SAME_POSITION');
	}
};

const getNumberOfSecondsToDivide = (timeInSeconds: number) => {
	if (timeInSeconds <= 60) {
		return 1;
	}

	const minutes = Math.floor(timeInSeconds / 60);
	return minutes + 1;
};

const buildDeviceReconstructedRoadResponse = (
	statusOfRebuildRoad: StatusOfRebuildRoadEnum,
	coords: Position[] = [],
	typeEnum: ReconstructedRoadTypeEnum = 'LineString',
	confidence: number = 0,
	tracepoints: string[] = [],
): DeviceReconstructedRoad => ({
	type: typeEnum,
	confidence,
	coords,
	tracepoints,
	statusOfRebuildRoad,
});
