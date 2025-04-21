import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import TrackingResponse from '@models/dto/response/tracking-response';
import Device from '@models/entity/device';
import TrackService from '@services/track.service';
import { handleAsArray } from '@utils/handle-response';
import { container } from 'tsyringe';
import { getTrackingCoordinates } from './device-sync-common';
import { getPercentageCompleted } from '@services/routes/get-percentage-completed';
import { getStopsInRoute } from '@services/routes/get-stops-in-route';
import { monitorConfig } from '@config/monitor-config';
import { catchError, Observable, of, tap } from 'rxjs';

const trackService = container.resolve(TrackService);

export const processByLastTrackIdDefined = (
	device: Device
): Observable<ApiResponse<TrackingResponse>> => {
	const { states } = device;

	return trackService.getById({ id: states?.LAST_TRACK_ID }).pipe(
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
		})
	);
};
