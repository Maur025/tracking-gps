import { concatMap, from, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import RouteService from './route.service';
import RouteCache from '@cache/route-cache';
import { handleAsArray } from '@utils/handle-response';

const routeCache = container.resolve(RouteCache);

const routeService = container.resolve(RouteService);

export const cacheInitializer = (): Observable<unknown> => {
	const routes$ = routeService.getAll();

	// const users$ = agregar implementacion

	return of(null).pipe(
		concatMap(() => routes$),
		tap(response => {
			const responseData = handleAsArray(response);

			routeCache.updateAll([...responseData]);
		})
	);
};
