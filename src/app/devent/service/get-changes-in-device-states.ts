import { DeviceStateDifference } from '@app/device/entity/device-state-difference.js';
import { DeviceState } from '@app/device/entity/device-state.js';
import { loggerDebug } from '@maur025/core-logger';
import z, { object } from 'zod';

const GetChangesInDeviceStatesRequest = object({
	states: DeviceState.optional(),
	previousStates: DeviceState.optional(),
});

type GetChangesInDeviceStatesRequest = z.infer<
	typeof GetChangesInDeviceStatesRequest
>;

const loggerAuxMessage = `[DEVENT] (getChangesInDeviceStates)`;

export const getChangesInDeviceStates = (
	request: GetChangesInDeviceStatesRequest,
): DeviceStateDifference[] => {
	const { states, previousStates } =
		GetChangesInDeviceStatesRequest.parse(request);

	if (!states) {
		loggerDebug(`${loggerAuxMessage} no device states provided.`);

		return [];
	}

	if (!previousStates) {
		loggerDebug(
			`${loggerAuxMessage} no previous device states provided. returning all as different.`,
		);

		return Object.entries(states).map(([name, value]) => ({
			currentValue: String(value),
			stateName: name,
			isDifferent: true,
		}));
	}

	const flexiblePreviousStates = previousStates as Record<
		string,
		boolean | string | number | undefined
	>;

	const differenceStates: DeviceStateDifference[] = [];

	for (const [stateName, currentValue] of Object.entries(states)) {
		const previousValue = flexiblePreviousStates[stateName];

		if (previousValue === undefined && currentValue !== undefined) {
			differenceStates.push({
				currentValue: String(currentValue),
				stateName,
				isDifferent: true,
			});

			continue;
		}

		const previousValueStr = String(previousValue);
		const isDifferent = previousValueStr !== String(currentValue);

		if (!isDifferent) {
			continue;
		}

		differenceStates.push({
			previousValue: previousValueStr,
			currentValue: String(currentValue),
			stateName,
			isDifferent,
		});
	}

	loggerDebug(`${loggerAuxMessage} changes in device states processed.`);
	return differenceStates;
};
