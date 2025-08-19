import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { loggerWarn } from '@maur025/core-logger';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response';
import { Geofence } from '@app/geofence/entity/geofence';
import { GeofenceData } from '@app/geofence/entity/geofence-data';
import { container } from 'tsyringe';
import { LayerType } from '@app/layer/entity/layer-type';
import { GeofenceType } from '../entity/geofence-type';
import PointInterestCache from '../../point-interest/cache/point-interest-cache';
import { deleteRedisIdx } from '@common/redis/service/delete-redis-idx';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addGeofenceBatchToRedis } from '../cache/add-geofence-batch-to-redis';

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

	await deleteRedisIdx(geofenceCache.getIdxData());
	await deleteRedisIdx(pointInterestCache.getIdxData());

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
): Geofence[] =>
	geofenceResponse.map(
		({
			id,
			data,
			layer_id,
			name,
			description,
			color,
			icon,
			coords,
			layer,
		}) => ({
			id,
			layerId: layer_id,
			name,
			description,
			color,
			icon,
			coords,
			data: getDataAsJson(data),
			layer: {
				...layer,
				name: layer?.name ?? '',
				type: LayerType.parse(layer?.type),
			},
		}),
	);

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
