import { concatMap, forkJoin, from, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import { handleAsArray } from '@src/api-client/service/handle-response';
import GeofenceService from '../../../app/geofence/service/geofence.service';
import { ApiResponse } from '@maur025/core-model-data';
import { geofenceCacheInit } from '../../../app/geofence/service/geofence-cache-init';
import GroupService from '../../../app/group/service/group.service';
import { groupCacheInit } from '../../../app/group/service/group-cache-init';
import { GeofenceResponse } from '@app/geofence/dto/geofence-response';
import { GroupResponse } from '@app/group/dto/group-response';
import DeviceCache from '@app/device/cache/device-cache';
import VehicleService from '@app/vehicle/service/vehicle.service';
import { vehicleCacheInit } from '@app/vehicle/service/vehicle-cache-init';
import { VehicleResponse } from '@app/vehicle/dto/vehicle-response';
import RuleService from '@app/rule/service/rule.service';
import { RuleResponse } from '@app/rule/dto/rule-response';
import { ruleCacheInit } from '@app/rule/service/rule-cache-init';
import DeventService from '@app/devent/service/devent.service';
import { DeventResponse } from '@app/devent/dto/devent-response';
import { deventCacheInit } from '@app/devent/service/devent-cache-init';

export const cacheInitializer = (): Observable<unknown> => {
	return of(null).pipe(
		concatMap(() => getParallelObservables$()),
		tap(async ({ vehicle, geofence, group, rule, devent }) => {
			await vehicleCacheInit(handleAsArray(vehicle));
			await geofenceCacheInit(handleAsArray(geofence));
			await groupCacheInit(handleAsArray(group));
			await ruleCacheInit(handleAsArray(rule));
			await deventCacheInit({ deventResponseList: handleAsArray(devent) });
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

	return forkJoin({
		vehicle: vehicle$,
		geofence: geofence$,
		group: group$,
		rule: rule$,
		devent: devent$,
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
