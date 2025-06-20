import Device from '@models/entity/device';
import WsDeviceService from '../server-ws-capture/ws-device.service';
import { container } from 'tsyringe';
import { ErrorResponse } from '@maur025/core-model-data';
import WsTrackResponse from '@models/dto/response/ws-track-response';
import { catchError, Observable, of, tap } from 'rxjs';

const wsDeviceService = container.resolve(WsDeviceService);

export const processByLasTrackIdEqualZero = (
	device: Device,
): Observable<WsTrackResponse> => {
	const { id } = device;

	if (!id) {
		console.warn(`device without id founded`);
		return of();
	}

	return wsDeviceService.getHistoryTracks({ deviceId: id }).pipe(
		tap((response: WsTrackResponse) => {
			device.tracks = response.tracks ?? [];

			// Logic needs to be completed

			device.isReady = true;
		}),
		catchError((error: ErrorResponse) => {
			console.error(`Error ocurred in getHistoryTracks: ${error}`);
			return of();
		}),
	);
};
