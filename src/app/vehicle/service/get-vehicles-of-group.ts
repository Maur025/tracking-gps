import { GroupVehicleResponse } from '@app/group/dto/group-vehicle-response';
import { getVehicleMetadata } from './get-vehicle-metadata';
import { loggerError } from '@maur025/core-logger';
import { Vehicle } from '../entity/vehicle';

export const getVehiclesOfGroup = (
	groupVehicles?: GroupVehicleResponse[],
): Vehicle[] => {
	if (!groupVehicles) {
		loggerError(`Error can't process undefined data`);
		return [];
	}

	return groupVehicles.map(({ vehicle: { type, name, metadata } }) => ({
		name,
		type,
		metadata: getVehicleMetadata(metadata),
	}));
};
