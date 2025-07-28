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

export const cacheInitializer = (): Observable<unknown> => {
	return of(null).pipe(
		concatMap(() => getParallelObservables$()),
		tap(async ({ geofence, group }) => {
			geofenceCacheInit(handleAsArray(geofence));
			await groupCacheInit(handleAsArray(group));
		}),
		concatMap(() => getSecuentialObservables$()),
	);
};

const getParallelObservables$ = (): Observable<{
	geofence: ApiResponse<GeofenceResponse>;
	group: ApiResponse<GroupResponse>;
}> => {
	const geofenceService$ = container.resolve(GeofenceService);
	const geofence$ = geofenceService$.getAllPaginated({ size: 1000 });

	const groupService$ = container.resolve(GroupService);
	const group$ = groupService$.getAllPaginated({ size: 500 });

	return forkJoin({
		geofence: geofence$,
		group: group$,
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
