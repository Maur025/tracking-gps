import environment from '@config/env.js';
import { loggerError, loggerWarn } from '@maur025/core-logger';
import z, { array, number, object } from 'zod/v4';
import { MatchDrivingResponse } from '@app/track/dto/response/match-driving/match-driving-response.js';

const { OSRM_URL } = environment;

const GetApproximateRoadOfOsrmRequest = object({
	coords: array(number()),
	previousCoords: array(number()),
});

type GetApproximateRoadOfOsrmRequest = z.infer<
	typeof GetApproximateRoadOfOsrmRequest
>;

const loggerAuxData = `[OSRM] (getApproximateRoadOfOsrm)`;

export const getApproximateRoadOfOsrm = async (
	request: GetApproximateRoadOfOsrmRequest,
): Promise<MatchDrivingResponse | undefined> => {
	const { coords, previousCoords } =
		GetApproximateRoadOfOsrmRequest.parse(request);

	const response = await fetch(
		`${OSRM_URL}/match/v1/driving/${coords[0]},${coords[1]};${previousCoords[0]},${previousCoords[1]}?geometries=geojson`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	).catch(() => undefined);

	if (!response) {
		loggerError(
			`${loggerAuxData} - Network error fetching OSRM data, or service not available.`,
		);

		return undefined;
	}

	if (!response.ok) {
		loggerError(
			`${loggerAuxData} - Error fetching OSRM data: ${response.statusText}`,
		);

		return undefined;
	}

	const responseData = await response.json();

	const validationData = MatchDrivingResponse.safeParse(responseData);

	if (!validationData.success) {
		loggerWarn(
			`${loggerAuxData} - Invalid OSRM response data structure, returning undefined.`,
		);

		return undefined;
	}

	return validationData.data;
};
