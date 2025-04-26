import { concatMap, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import RouteService from './routes/route.service';
import RouteCache from '@cache/route-cache';
import { handleAsArray } from '@utils/handle-response';
import GeofenceService from './geofence/geofence.service';
import { ApiResponse } from '@maur025/core-model-data';
import GeofenceResponse from '@models/dto/response/geofence-response';
import { geofenceCacheInit } from './geofence-cache-init';

const routeCache = container.resolve(RouteCache);

const routeService = container.resolve(RouteService);
const geofenceService$ = container.resolve(GeofenceService);

export const cacheInitializer = (): Observable<unknown> => {
	const routes$ = routeService.getAll();
	const geofence$ = geofenceService$.getAllPaginated({});

	return of(null).pipe(
		concatMap(() => routes$),
		tap(response => {
			const responseData = handleAsArray(response);

			routeCache.updateAll([...responseData]);
		}),
		concatMap(() => geofence$),
		tap((response: ApiResponse<GeofenceResponse>) => {
			geofenceCacheInit(handleAsArray(response));
		})
	);
};
