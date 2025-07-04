import { concatMap, forkJoin, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import { handleAsArray } from '@utils/handle-response';
import GeofenceService from './geofence/geofence.service';
import { ApiResponse } from '@maur025/core-model-data';
import GeofenceResponse from '@models/dto/response/geofence-response';
import { geofenceCacheInit } from './geofence-cache-init';
import GroupService from './group/group.service';
import { groupCacheInit } from './cache/group/group-cache-init';
import { GroupResponse } from '@models/dto/response/group-response';

const geofenceService$ = container.resolve(GeofenceService);
const groupService$ = container.resolve(GroupService);

export const cacheInitializer = (): Observable<unknown> => {
	return of(null).pipe(
		concatMap(() => getParallelObservables$()),
		tap(({ geofence, group }) => {
			geofenceCacheInit(handleAsArray(geofence));
			groupCacheInit(handleAsArray(group));
		}),
		concatMap(() => getSecuentialObservables$()),
	);
};

const getParallelObservables$ = (): Observable<{
	geofence: ApiResponse<GeofenceResponse>;
	group: ApiResponse<GroupResponse>;
}> => {
	const geofence$ = geofenceService$.getAllPaginated({ size: 1000 });
	const group$ = groupService$.getAllPaginated({ size: 500 });

	return forkJoin({
		geofence: geofence$,
		group: group$,
	});
};

const getSecuentialObservables$ = (): Observable<void> => of();
