import WsDeviceService from './ws-device.service';
import { container } from 'tsyringe';
import { ErrorResponse } from '@maur025/core-model-data';
import { catchError, Observable, of, tap } from 'rxjs';
import { Device } from '../entity/device';
import { WsTrackResponse } from '@app/track/dto/ws-track-response';

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
