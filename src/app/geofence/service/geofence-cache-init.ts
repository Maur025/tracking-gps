import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { loggerWarn } from '@maur025/core-logger';
import { GeofenceResponse } from '@app/geofence/dto/geofence-response';
import { Geofence } from '@app/geofence/entity/geofence';
import { GeofenceData } from '@app/geofence/entity/geofence-data';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

const geofenceCache = container.resolve(GeofenceCache);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const geofenceCacheInit = (responseList: GeofenceResponse[]): void => {
	geofenceCache.clear();

	const geofenceList: Geofence[] = [];
	// responseList?.map(geofence => ({
	// 	...geofence,
	// 	data: getDataAsJson(geofence.data),
	// }));

	geofenceCache.addMany(geofenceList);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDataAsJson = (data?: string): GeofenceData[] => {
	if (!data) {
		return [];
	}

	try {
		const dataJson: unknown = JSON.parse(data);

		if (!dataJson) {
			return [];
		}

		const dataList: GeofenceData[] = Array.isArray(dataJson)
			? dataJson
			: [dataJson];

		return dataList.map(geofenceData => ({
			...geofenceData,
			internalId: uuidv4(),
		}));
	} catch (error) {
		loggerWarn(
			`Error to trying convert string to json, returning empty array. ${error}`,
		);

		return [];
	}
};
