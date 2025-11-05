import { concatMap, forkJoin, from, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import { handleAsArray } from '@src/api-client/service/handle-response.js';
import GeofenceService from '../../../app/geofence/service/geofence.service.js';
import { ApiResponse } from '@maur025/core-model-data';
import { geofenceCacheInit } from '../../../app/geofence/service/geofence-cache-init.js';
import GroupService from '../../../app/group/service/group.service.js';
import { groupCacheInit } from '../../../app/group/service/group-cache-init.js';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response.js';
import { GroupResponse } from '@app/group/dto/response/group-response.js';
import DeviceCache from '@app/device/cache/device-cache.js';
import VehicleService from '@app/vehicle/service/vehicle.service.js';
import { vehicleCacheInit } from '@app/vehicle/service/vehicle-cache-init.js';
import { VehicleResponse } from '@app/vehicle/dto/response/vehicle-response.js';
import RuleService from '@app/rule/service/rule.service.js';
import { RuleResponse } from '@app/rule/dto/response/rule-response.js';
import { ruleCacheInit } from '@app/rule/service/rule-cache-init.js';
import DeventService from '@app/devent/service/devent.service.js';
import { DeventResponse } from '@app/devent/dto/response/devent-response.js';
import { deventCacheInit } from '@app/devent/service/devent-cache-init.js';
import ChannelService from '@app/channel/service/channel.service.js';
import { ChannelResponse } from '@app/channel/dto/response/channel-response.js';
import { channelCacheInit } from '@app/channel/service/channel-cache-init.js';

export const cacheInitializer = (): Observable<unknown> => {
	return of(null).pipe(
		concatMap(() => getParallelObservables$()),
		tap(async ({ vehicle, geofence, group, rule, devent, channel }) => {
			await vehicleCacheInit(handleAsArray(vehicle));
			await geofenceCacheInit(handleAsArray(geofence));
			await groupCacheInit(handleAsArray(group));
			await ruleCacheInit(handleAsArray(rule));
			await deventCacheInit({ deventResponseList: handleAsArray(devent) });
			await channelCacheInit({ channelResponseList: handleAsArray(channel) });
		}),
		concatMap(() => getSecuentialObservables$()),
	);
};

const getParallelObservables$ = (): Observable<{
	vehicle: ApiResponse<VehicleResponse>;
	geofence: ApiResponse<GeofenceResponse>;
	group: ApiResponse<GroupResponse>;
	rule: ApiResponse<RuleResponse>;
	devent: ApiResponse<DeventResponse>;
	channel: ApiResponse<ChannelResponse>;
}> => {
	const vehicleService$ = container.resolve(VehicleService);
	const vehicle$ = vehicleService$.getAllPaginated({ size: 5000 });

	const geofenceService$ = container.resolve(GeofenceService);
	const geofence$ = geofenceService$.getAllPaginated({ size: 1000 });

	const groupService$ = container.resolve(GroupService);
	const group$ = groupService$.getAllPaginated({ size: 5000 });

	const ruleService$ = container.resolve(RuleService);
	const rule$ = ruleService$.getAllPaginated({ size: 5000 });

	const deventService = container.resolve(DeventService);
	const devent$ = deventService.getAllPaginated({ size: 5000 });

	const channelService = container.resolve(ChannelService);
	const channel$ = channelService.getAllPaginated({ size: 5000 });

	return forkJoin({
		vehicle: vehicle$,
		geofence: geofence$,
		group: group$,
		rule: rule$,
		devent: devent$,
		channel: channel$,
	});
};

const getSecuentialObservables$ = (): Observable<{
	reloadDeviceCache: void;
}> => {
	const deviceCache = container.resolve(DeviceCache);
	const reloadDeviceCache$ = from(deviceCache.loadCacheData());

	return forkJoin({
		reloadDeviceCache: reloadDeviceCache$,
	});
};
