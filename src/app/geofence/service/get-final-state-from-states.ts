import z, { array, boolean, object } from 'zod/v4';
import { GeofenceCalculateStates } from '../entity/geofence-calculate-state';

const GetFinalStateFromStatesRequest = object({
	stateList: array(boolean()),
	initialState: GeofenceCalculateStates,
});

type GetFinalStateFromStatesRequest = z.infer<
	typeof GetFinalStateFromStatesRequest
>;

export const getFinalStateFromStates = (
	request: GetFinalStateFromStatesRequest,
) => {
	const { stateList, initialState } =
		GetFinalStateFromStatesRequest.parse(request);

	let finalState: GeofenceCalculateStates = 'NONE';

	for (const state of stateList) {
		if (state && finalState === 'NONE' && initialState === 'NONE') {
			finalState = 'IN';
		}

		if (!state && finalState === 'IN' && initialState === 'NONE') {
			finalState = 'IN_OUT';
		}

		if (!state && finalState === 'NONE' && initialState === 'IN') {
			finalState = 'OUT';
		}

		if (state && finalState === 'OUT' && initialState === 'IN') {
			finalState = 'IN';
		}
	}

	return finalState;
};
