import { container } from 'tsyringe';
import { handleAsArray } from '@src/api-client/service/handle-response.js';
import GeofenceService from '../../../app/geofence/service/geofence.service.js';
import { geofenceCacheInit } from '../../../app/geofence/service/geofence-cache-init.js';
import GroupService from '../../../app/group/service/group.service.js';
import { groupCacheInit } from '../../../app/group/service/group-cache-init.js';
import DeviceCache from '@app/device/cache/device-cache.js';
import VehicleService from '@app/vehicle/service/vehicle.service.js';
import { vehicleCacheInit } from '@app/vehicle/service/vehicle-cache-init.js';
import RuleService from '@app/rule/service/rule.service.js';
import { ruleCacheInit } from '@app/rule/service/rule-cache-init.js';
import DeventService from '@app/devent/service/devent.service.js';
import { deventCacheInit } from '@app/devent/service/devent-cache-init.js';
import ChannelService from '@app/channel/service/channel.service.js';
import { channelCacheInit } from '@app/channel/service/channel-cache-init.js';

export const cacheInitializer = async (): Promise<void> => {
	await getFirstBatchInParallel();

	await getSecondBatchInParallel();
};

const getFirstBatchInParallel = async () => {
	const vehicleService = container.resolve(VehicleService);
	const geofenceService = container.resolve(GeofenceService);
	const groupService = container.resolve(GroupService);
	const ruleService = container.resolve(RuleService);
	const deventService = container.resolve(DeventService);
	const channelService = container.resolve(ChannelService);

	const [
		vehicleApiResponse,
		geofenceApiResponse,
		groupApiResponse,
		ruleApiResponse,
		deventApiResponse,
		channelApiResponse,
	] = await Promise.all([
		vehicleService.getAllPaginated({ size: 5000 }),
		geofenceService.getAllPaginated({ size: 1000 }),
		groupService.getAllPaginated({ size: 5000 }),
		ruleService.getAllPaginated({ size: 5000 }),
		deventService.getAllPaginated({ size: 5000 }),
		channelService.getAllPaginated({ size: 5000 }),
	]);

	await vehicleCacheInit(handleAsArray(vehicleApiResponse));
	await geofenceCacheInit(handleAsArray(geofenceApiResponse));
	await groupCacheInit(handleAsArray(groupApiResponse));
	await ruleCacheInit(handleAsArray(ruleApiResponse));
	await deventCacheInit({
		deventResponseList: handleAsArray(deventApiResponse),
	});
	await channelCacheInit({
		channelResponseList: handleAsArray(channelApiResponse),
	});
};

const getSecondBatchInParallel = async (): Promise<void> => {
	const deviceCache = container.resolve(DeviceCache);

	await Promise.all([deviceCache.loadCacheData()]);
};
