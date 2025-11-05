import { loggerWarn } from '@maur025/core-logger';
import { VehicleMetadata } from '../entity/vehicle-metadata.js';

export const getVehicleMetadata = (metadata?: string): VehicleMetadata => {
	if (!metadata) {
		return {};
	}

	try {
		const dataJson = JSON.parse(metadata);

		if (!dataJson) {
			return {};
		}

		return dataJson as VehicleMetadata;
	} catch (error) {
		loggerWarn(
			`Error to convert metadata to Json, returning empty array. ${error}`,
		);

		return {};
	}
};
