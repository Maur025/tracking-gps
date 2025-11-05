import GeofenceCache from '@app/geofence/cache/geofence-cache.js';
import { loggerDebug, loggerWarn } from '@maur025/core-logger';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response.js';
import { Geofence } from '@app/geofence/entity/geofence.js';
import { GeofenceData } from '@app/geofence/entity/geofence-data.js';
import { container } from 'tsyringe';
import { LayerType } from '@app/layer/entity/layer-type.js';
import { GeofenceType } from '../entity/geofence-type.js';
import PointInterestCache from '../../point-interest/cache/point-interest-cache.js';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch.js';
import { addGeofenceBatchToRedis } from '../cache/add-geofence-batch-to-redis.js';

export const geofenceCacheInit = async (
	responseList: GeofenceResponse[],
): Promise<void> => {
	if (!responseList?.length) {
		loggerWarn(
			`[GEOFENCE] (geofenceCacheInit) geofence not data found, skipping ...`,
		);

		return;
	}

	const geofenceCache = container.resolve(GeofenceCache);
	const pointInterestCache = container.resolve(PointInterestCache);

	geofenceCache.clear();
	pointInterestCache.clear();

	const geofenceResponseList: GeofenceResponse[] = [];
	const pointInterestResponseList: GeofenceResponse[] = [];

	for (const geofence of responseList) {
		const { layer } = geofence;

		if (!layer?.type) {
			continue;
		}

		if (layer?.type === 'POINTS_INTEREST') {
			pointInterestResponseList.push(geofence);

			continue;
		}

		geofenceResponseList.push(geofence);
	}

	const geofenceList: Geofence[] =
		getGeofenceOfGeofenceResponse(geofenceResponseList);

	const pointInterestList: Geofence[] = getGeofenceOfGeofenceResponse(
		pointInterestResponseList,
	);

	geofenceCache.addMany(geofenceList);
	pointInterestCache.addMany(pointInterestList);

	await addDataInBatch<Geofence>({
		dataList: geofenceList,
		dataBaseKey: geofenceCache.getRedisKey(),
		registerInRedisFn: addGeofenceBatchToRedis,
	});

	await addDataInBatch<Geofence>({
		dataList: pointInterestList,
		dataBaseKey: pointInterestCache.getRedisKey(),
		registerInRedisFn: addGeofenceBatchToRedis,
	});
};

const getGeofenceOfGeofenceResponse = (
	geofenceResponse: GeofenceResponse[],
): Geofence[] => {
	const geofenceList: Geofence[] = [];

	for (const geofence of geofenceResponse) {
		const {
			id,
			data,
			layer_id,
			name,
			description,
			color,
			icon,
			coords,
			layer,
		} = geofence;

		const dataInJson = getDataAsJson(data);
		const geofenceData = GeofenceData.safeParse(dataInJson);

		if (!geofenceData.success) {
			loggerDebug(
				`[GEOFENCE] (getGeofenceOfGeofenceResponse) geofence data parse error for geofence id: ${id}, skipping...`,
			);

			continue;
		}

		geofenceList.push({
			id,
			layerId: layer_id,
			name,
			description,
			color,
			icon,
			coords,
			data: geofenceData.data,
			layer: {
				...layer,
				name: layer?.name ?? '',
				type: LayerType.parse(layer?.type),
			},
		});
	}

	return geofenceList;
};

const getDataAsJson = (data?: string): GeofenceData | undefined => {
	if (!data) {
		return undefined;
	}

	try {
		const dataJson: unknown = JSON.parse(data);

		if (!dataJson) {
			return undefined;
		}

		const dataToUse: GeofenceData =
			Array.isArray(dataJson) && dataJson.length > 0 ? dataJson[0] : dataJson;

		return {
			area: dataToUse.area,
			radius: dataToUse.radius,
			type: dataToUse.type ? GeofenceType.parse(dataToUse.type) : undefined,
			coords: dataToUse.coords,
			name: dataToUse.name,
		};
	} catch (error) {
		loggerWarn(
			`Error to trying convert string to json, returning empty array. ${error}`,
		);

		return undefined;
	}
};
