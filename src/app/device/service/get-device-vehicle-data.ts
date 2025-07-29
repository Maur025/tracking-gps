import { Vehicle } from '@app/vehicle/entity/vehicle';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import VehicleCache from '@app/vehicle/cache/vehicle-cache';
import { redisClient } from '@common/redis/create-redis-client';
import { loggerError } from '@maur025/core-logger';

export const getDeviceVehicleData = async (
	device: Device,
	deviceInMapCache: Device | undefined,
): Promise<Vehicle | undefined> => {
	if (deviceInMapCache?.vehicleData) {
		return deviceInMapCache.vehicleData;
	}

	const vehicleCache = container.resolve(VehicleCache);

	const result = await redisClient.ft.search(
		vehicleCache.getIdxData(),
		`@deviceId:{${device.id}}`,
		{
			LIMIT: { from: 0, size: 1 },
		},
	);

	if (typeof result !== 'object') {
		loggerError(
			`Search result expected should be an object, but received a ${typeof result}.`,
		);

		return undefined;
	}

	const resultAsObject = result as {
		total: number;
		documents: { id: string; value: Vehicle }[];
	};

	if (!resultAsObject.total) {
		loggerError(
			`vehicle not asignment to device ${device.id}, data not found in search.`,
		);

		return undefined;
	}

	const vehicleData: Vehicle = {
		...resultAsObject.documents[0].value,
	};

	return vehicleData;
};
