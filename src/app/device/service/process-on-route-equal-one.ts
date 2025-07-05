import { ErrorResponse } from '@maur025/core-model-data';
import WsDeviceService from '@app/device/service/ws-device.service';
import { container } from 'tsyringe';
import { catchError, Observable, of, tap } from 'rxjs';
import { getTrackingCoordinates } from './device-sync-common';
import RouteCache from '@app/route/cache/route-cache';
import { Device } from '../entity/device';
import { Route } from '@app/route/entity/route';
import { getStopsInRoute } from '@app/route/service/get-stops-in-route';
import { WsTrackResponse } from '@app/track/dto/ws-track-response';

const wsDeviceService = container.resolve(WsDeviceService);
const routeCache = container.resolve(RouteCache);

export const processOnRouteEqualOne = (
	device: Device,
): Observable<WsTrackResponse> => {
	const { id, states } = device;

	if (!id) {
		console.warn(`device without id founded`);
		return of();
	}

	const routeList: Route[] = routeCache.getAll();

	return wsDeviceService.getTracks({ deviceId: id }).pipe(
		tap((response: WsTrackResponse) => {
			if (!response) {
				device.isReady = false;
				return;
			}

			device.tracks = response.tracks ?? [];
			const { tracks } = device;

			if (tracks.length) {
				device.last = tracks[tracks.length - 1];
			}

			device.stops = getStopsInRoute(tracks);
			device.tracksCoord = getTrackingCoordinates(device);

			device.routeSelected = routeList.find(
				({ id }) => id === states?.ID_ROUTE,
			);

			// Logic needs to be completed

			device.isReady = true;
		}),
		catchError((error: ErrorResponse) => {
			console.error('Error ocurred in process on route equal one: ', error);

			return of();
		}),
	);
};
