import z, { object, string } from 'zod/v4';
import {
	DeviceReconstructedRoad,
	ReconstructedRoadTypeEnum,
} from '../entity/device-reconstructed-road';
import { Track } from '@app/track/entity/track';
import { loggerDebug } from '@maur025/core-logger';
import { Feature, GeoJsonProperties, LineString, Position } from 'geojson';
import { DeviceMovingDirection } from '../entity/device-moving-direction';
import { getTotalSecondsElapsedSincePreviousTimestamp } from './get-total-elapsed-since-previous-timestamp';
import { StatusOfRebuildRoadEnum } from '../entity/device-reconstructed-road';
import environment from '@config/env';
import {
	distance as turfDistance,
	lineString as turfLineString,
	length as turfLength,
} from '@turf/turf';
import { runComplexRebuildRoad } from './run-complex-rebuild-road';
import { getReconstructedRoadCoordsList } from './get-reconstructed-road-list';

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

	if (distanceBetweenPointsInMeters < 1) {
		loggerDebug(
			`${loggerAuxData} Distance between points is less than 1 meter, using two points directly.`,
		);

		return buildDeviceReconstructedRoadResponse(
			'REBUILD_SUCCESS',
			[previousCoords, currentCoords],
			'LineString',
			1,
		);
	}

	const distanceTraveledEachSecond =
		distanceBetweenPointsInMeters / timeElapsedSincePreviousTrack;

	let reconstructedRoadFlatLine: Feature<LineString, GeoJsonProperties>;
	let calculatedConfidence = 1;
	let calculatedTracePoints: string[] = [];

	if (
		distanceTraveledEachSecond > MAX_METERS_PER_SECOND ||
		(movingDirection.differenceInGrades !== undefined &&
			movingDirection.differenceInGrades < 10 &&
			movingDirection.differenceInGrades > -10)
	) {
		reconstructedRoadFlatLine = turfLineString([previousCoords, currentCoords]);
	} else {
		const complexRebuildResponse = await runComplexRebuildRoad({
			coords: currentCoords,
			previousCoords,
		});

		reconstructedRoadFlatLine =
			complexRebuildResponse.reconstructedRoadFlatLine;

		calculatedConfidence =
			complexRebuildResponse.calculatedConfidence ?? calculatedConfidence;

		calculatedTracePoints = complexRebuildResponse.calculatedTracePoints;
	}

	const reconstructedRoadFlatLength = turfLength(reconstructedRoadFlatLine, {
		units: 'meters',
	});

	if (reconstructedRoadFlatLength < 1) {
		loggerDebug(
			`${loggerAuxData} Reconstructed road length is less than 1 meter. Using two points directly.`,
		);

		return buildDeviceReconstructedRoadResponse(
			'REBUILD_SUCCESS',
			[previousCoords, currentCoords],
			'LineString',
			0.5,
		);
	}

	const reconstructedRoadCoordList = getReconstructedRoadCoordsList(
		reconstructedRoadFlatLine,
		reconstructedRoadFlatLength,
	);

	loggerDebug(
		`${loggerAuxData} Reconstructed road with ${
			reconstructedRoadCoordList.length
		} points.`,
	);

	return buildDeviceReconstructedRoadResponse(
		'REBUILD_SUCCESS',
		reconstructedRoadCoordList,
		'LineString',
		calculatedConfidence,
		calculatedTracePoints,
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

const buildDeviceReconstructedRoadResponse = (
	statusOfRebuildRoad: StatusOfRebuildRoadEnum,
	coords: Position[] = [],
	typeEnum: ReconstructedRoadTypeEnum = 'LineString',
	confidence: number = 0,
	tracePoints: string[] = [],
): DeviceReconstructedRoad => ({
	type: typeEnum,
	confidence,
	coords,
	tracePoints,
	statusOfRebuildRoad,
});
