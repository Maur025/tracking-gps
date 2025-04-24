import { concatMap, from, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import RouteService from './routes/route.service';
import RouteCache from '@cache/route-cache';
import { handleAsArray } from '@utils/handle-response';
import GeofenceService from './geofence/geofence.service';

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
		tap(response => {
			console.log(response);
		})
	);
};
