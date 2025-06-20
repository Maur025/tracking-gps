import { concatMap, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import { handleAsArray } from '@utils/handle-response';
import GeofenceService from './geofence/geofence.service';
import { ApiResponse } from '@maur025/core-model-data';
import GeofenceResponse from '@models/dto/response/geofence-response';
import { geofenceCacheInit } from './geofence-cache-init';
import GroupService from './group/group.service';

const geofenceService$ = container.resolve(GeofenceService);
const groupService$ = container.resolve(GroupService);

export const cacheInitializer = (): Observable<unknown> => {
	const geofence$ = geofenceService$.getAllPaginated({});
	const group$ = groupService$.getAllPaginated({ size: 500 });

	return of(null).pipe(
		concatMap(() => geofence$),
		tap((response: ApiResponse<GeofenceResponse>) => {
			geofenceCacheInit(handleAsArray(response));
		}),
		concatMap(() => group$),
		tap(response => {
			console.log(response);
		}),
	);
};
