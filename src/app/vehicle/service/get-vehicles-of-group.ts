import { GroupVehicleResponse } from '@app/group/dto/response/group-vehicle-response';
import { getVehicleMetadata } from './get-vehicle-metadata';
import { loggerError } from '@maur025/core-logger';
import { Vehicle } from '../entity/vehicle';
import { getVehicleDeviceMap } from './get-vehicle-device-map';

export const getVehiclesOfGroup = async (
	groupVehicles?: GroupVehicleResponse[],
): Promise<Vehicle[]> => {
	if (!groupVehicles) {
		loggerError(`Error can't process undefined data`);
		return [];
	}

	const vehicleDeviceMap: Map<string, string> = await getVehicleDeviceMap({
		groupVehicles,
	});

	return groupVehicles.map(
		({ vehicle: { id = '', type, name, metadata } }) => ({
			name,
			type,
			metadata: getVehicleMetadata(metadata),
			id,
			deviceId: id && vehicleDeviceMap.has(id) ? vehicleDeviceMap.get(id) : '',
		}),
	);
};
