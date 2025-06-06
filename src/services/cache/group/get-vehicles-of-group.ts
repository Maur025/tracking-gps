import { GroupVehicleResponse } from '@models/dto/response/group-vehicle-response';
import { Vehicle } from '@models/entity/vehicle';
import { getVehicleMetadata } from './get-vehicle-metadata';
import { loggerError } from '@maur025/core-logger';

export const getVehiclesOfGroup = (
	groupVehicles?: GroupVehicleResponse[]
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
