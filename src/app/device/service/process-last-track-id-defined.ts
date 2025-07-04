import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import TrackService from '@app/track/service/track.service';
import { handleAsArray } from '@utils/handle-response';
import { container } from 'tsyringe';
import { getTrackingCoordinates } from './device-sync-common';
import { monitorConfig } from '@config/monitor-config';
import { catchError, Observable, of, tap } from 'rxjs';
import { Device } from '../entity/device';
import { TrackingResponse } from '@app/track/dto/tracking-response';
import { getPercentageCompleted } from '@app/route/service/get-percentage-completed';
import { getStopsInRoute } from '@app/route/service/get-stops-in-route';

const trackService = container.resolve(TrackService);

export const processByLastTrackIdDefined = (
	device: Device,
): Observable<ApiResponse<TrackingResponse>> => {
	const { states } = device;

	return trackService.getById({ id: states?.LAST_TRACK_ID ?? '' }).pipe(
		tap((response: ApiResponse<TrackingResponse>) => {
			const dataResponse: TrackingResponse[] = handleAsArray(response);

			if (!dataResponse.length) {
				return;
			}

			device.tracks = dataResponse[0]?.trackb64 ?? [];
			const { tracks = [] } = device;

			if (tracks.length) {
				device.last = tracks[tracks.length - 1];
				device.tracksCoord = getTrackingCoordinates(device);
			}

			if (device.routeSelected != undefined) {
				device.routeSelected.completed = getPercentageCompleted({
					routeSelected: device.routeSelected,
					trackList: tracks,
					maxPointDistance: monitorConfig.MAX_POINT_DISTANCE,
				});
			}

			device.stops = getStopsInRoute(tracks);
			device.isReady = true;
		}),
		catchError((error: ErrorResponse) => {
			console.log(error);
			return of();
		}),
	);
};
