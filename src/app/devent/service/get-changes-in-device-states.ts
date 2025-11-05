import { DeviceStateDifference } from '@app/device/entity/device-state-difference.js';
import { DeviceState } from '@app/device/entity/device-state.js';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object } from 'zod';

const GetChangesInDeviceStatesRequest = object({
	states: DeviceState.optional(),
	previousDifferenceStateList: array(DeviceStateDifference).default([]),
});

type GetChangesInDeviceStatesRequest = z.infer<
	typeof GetChangesInDeviceStatesRequest
>;

const loggerAuxMessage = `[DEVENT] (getChangesInDeviceStates)`;

export const getChangesInDeviceStates = (
	request: GetChangesInDeviceStatesRequest,
): DeviceStateDifference[] => {
	const { states, previousDifferenceStateList } =
		GetChangesInDeviceStatesRequest.parse(request);

	if (!states) {
		loggerDebug(`${loggerAuxMessage} no device states provided.`);

		return [];
	}

	const previousDifferenceStateMap = new Map<string, DeviceStateDifference>(
		previousDifferenceStateList.map(previous => [previous.stateName, previous]),
	);

	const differenceStates: DeviceStateDifference[] = [];

	for (const [stateName, currentValue] of Object.entries(states)) {
		if (stateName !== 'SPEED') {
			continue;
		}

		if (!previousDifferenceStateMap.has(stateName)) {
			differenceStates.push({
				currentValue: String(currentValue),
				stateName,
				isDifferent: true,
			});

			continue;
		}

		const previousDifferenceState = previousDifferenceStateMap.get(stateName);

		if (!previousDifferenceState) {
			differenceStates.push({
				currentValue: String(currentValue),
				stateName,
				isDifferent: true,
			});
			continue;
		}

		const isDifferent =
			previousDifferenceState.currentValue !== String(currentValue);

		differenceStates.push({
			previousValue: previousDifferenceState.currentValue,
			currentValue: String(currentValue),
			stateName,
			isDifferent,
		});
	}

	loggerDebug(`${loggerAuxMessage} changes in device states processed.`);
	return differenceStates;
};
