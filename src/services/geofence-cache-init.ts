import GeofenceCache from '@cache/geofence-cache';
import GeofenceResponse from '@models/dto/response/geofence-response';
import Geofence from '@models/entity/geofence';
import GeofenceData from '@models/entity/geofence-data';
import { loggerWarn } from '@utils/logger';
import { container } from 'tsyringe';

const geofenceCache = container.resolve(GeofenceCache);

export const geofenceCacheInit = (responseList: GeofenceResponse[]): void => {
	const geofenceList: Geofence[] = responseList?.map(geofence => ({
		...geofence,
		data: getDataAsJson(geofence.data),
	}));

	geofenceCache.updateAll(geofenceList);
};

const getDataAsJson = (data?: string): GeofenceData[] => {
	if (!data) {
		return [];
	}

	try {
		const dataJson: GeofenceData[] = JSON.parse(data);

		if (!dataJson) {
			return [];
		}

		return Array.isArray(dataJson) ? dataJson : [dataJson];
	} catch (error) {
		loggerWarn(
			`Error to trying convert string to json, returning empty array. ${error}`
		);

		return [];
	}
};
