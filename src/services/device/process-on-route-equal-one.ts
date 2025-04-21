import { ErrorResponse } from '@maur025/core-model-data';
import Device from '@models/entity/device';
import WsDeviceService from '@services/server-ws-capture/ws-device.service';
import { container } from 'tsyringe';
import WsTrackResponse from '@models/dto/response/ws-track-response';
import { catchError, Observable, of, tap } from 'rxjs';
import { getStopsInRoute } from '@services/routes/get-stops-in-route';
import { getTrackingCoordinates } from './device-sync-common';

const wsDeviceService = container.resolve(WsDeviceService);

export const processOnRouteEqualOne = (
	device: Device
): Observable<WsTrackResponse> => {
	const { id } = device;

	console.log(id);

	if (!id) {
		console.warn(`device without id founded`);

		return of();
	}

	return wsDeviceService.getTracks({ deviceId: id }).pipe(
		tap((response: WsTrackResponse) => {
			console.log('se realizo la asignacion');

			device.tracks = response.tracks ?? [];
			const { tracks } = device;

			if (tracks.length) {
				device.last = tracks[tracks.length - 1];
			}

			device.stops = getStopsInRoute(tracks);
			device.tracksCoord = getTrackingCoordinates(device);
			device.routeSelected = {};

			if (tracks.length) {
				//console.log(device);
			}
		}),
		catchError((error: ErrorResponse) => {
			console.error('Error ocurred in process on route equal one: ', error);

			return of();
		})
	);
};
