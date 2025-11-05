import { Feature, GeoJsonProperties, LineString } from 'geojson';
import z, { any, array, number, object, string } from 'zod/v4';
import { getApproximateRoadOfOsrm } from './get-approximate-road-of-osrm';
import { lineString as turfLineString } from '@turf/turf';
import { loggerDebug } from '@maur025/core-logger';
import { MatchingResponse } from '@app/track/dto/response/match-driving/matching-response';

const RunComplexRebuildRoadReq = object({
	coords: array(number()),
	previousCoords: array(number()),
});

type RunComplexRebuildRoadReq = z.infer<typeof RunComplexRebuildRoadReq>;

const RunComplexRebuildRoadRes = object({
	calculatedConfidence: number(),
	calculatedTracePoints: array(string()),
	reconstructedRoadFlatLine: any(),
});

export type RunComplexRebuildRoadRes = Omit<
	z.infer<typeof RunComplexRebuildRoadRes>,
	'reconstructedRoadFlatLine'
> & { reconstructedRoadFlatLine: Feature<LineString, GeoJsonProperties> };

const loggerAuxData = `[COMPLEX-REBUILD-ROAD] (runComplexRebuildRoad)`;

export const runComplexRebuildRoad = async (
	request: RunComplexRebuildRoadReq,
): Promise<RunComplexRebuildRoadRes> => {
	const { coords, previousCoords } = RunComplexRebuildRoadReq.parse(request);

	const complexRebuildResponse: RunComplexRebuildRoadRes = {
		calculatedConfidence: 0,
		calculatedTracePoints: [],
		reconstructedRoadFlatLine: {} as Feature<LineString, GeoJsonProperties>,
	};

	const matchingRoadResponse = await getApproximateRoadOfOsrm({
		coords,
		previousCoords,
	});

	if (!matchingRoadResponse?.matchings?.length) {
		loggerDebug(
			`${loggerAuxData} fail fetch to OSRM server, no matching road found, using flat line.`,
		);

		return {
			...complexRebuildResponse,
			reconstructedRoadFlatLine: turfLineString([previousCoords, coords]),
		};
	} else {
		const mostReliableMatch: MatchingResponse =
			matchingRoadResponse.matchings.reduce((prev, match) =>
				match.confidence > prev.confidence ? match : prev,
			);

		return {
			...complexRebuildResponse,
			reconstructedRoadFlatLine: turfLineString([
				...mostReliableMatch.geometry.coordinates,
			]),
			calculatedConfidence: mostReliableMatch.confidence,
			calculatedTracePoints: matchingRoadResponse.tracepoints.map(
				tracePoint => tracePoint.name,
			),
		};
	}
};
