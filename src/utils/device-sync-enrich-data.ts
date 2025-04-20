import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import TrackingResponse from '@models/dto/response/tracking-response';
import Device from '@models/entity/device';
import TrackService from '@services/track.service';
import { catchError, from, mergeMap, Observable, of, tap } from 'rxjs';
import { container } from 'tsyringe';
import { handleAsArray } from './handle-response';
import { getPercentageCompleted, getStopsInRoute } from './routes-util';

const MAX_POINT_DISTANCE = 20;

const trackService = container.resolve(TrackService);

export const syncAndEnrichDevices = (devices: Device[]): Device[] => {
	const deviceList: Device[] = [...devices];

	from(deviceList)
		.pipe(mergeMap((device: Device) => syncDevice$(device), 10))
		.subscribe();

	console.log(deviceList);

	return [...deviceList];
};

const syncDevice$ = (device: Device) => {
	const { states } = device;

	// if (states?.ON_ROUTE === '1') {
	// 	return of();
	// }

	// if (!states?.LAST_TRACK_ID) {
	// 	return of();
	// }

	if (states?.LAST_TRACK_ID === '0') {
		return of();
	}

	return processByLastTrackIdDefined(device);
};

const processByLastTrackIdDefined = (
	device: Device
): Observable<ApiResponse<TrackingResponse>> => {
	const { states } = device;

	return trackService.getById({ id: states?.LAST_TRACK_ID }).pipe(
		tap((response: ApiResponse<TrackingResponse>) => {
			const dataResponse: TrackingResponse[] = handleAsArray(response);

			if (!dataResponse.length) {
				return;
			}

			device = patchDeviceData(device, { tracks: dataResponse[0]?.trackb64 });
			const { tracks = [] } = device;

			if (tracks.length) {
				device = patchDeviceData(device, {
					last: tracks[tracks.length - 1],
					tracksCoord: getTrackingCoordinates(device),
				});
			}

			if (device.routeSelected != undefined) {
				device = patchDeviceData(device, {
					routeSelected: {
						...device.routeSelected,
						completed: getPercentageCompleted({
							routeSelected: device.routeSelected,
							trackList: tracks,
							maxPointDistance: MAX_POINT_DISTANCE,
						}),
					},
				});
			}

			device = patchDeviceData(device, {
				stops: getStopsInRoute(tracks),
				isReady: true,
			});
		}),
		catchError((error: ErrorResponse) => {
			console.log(error);
			return of();
		})
	);
};

const getTrackingCoordinates = ({ tracks }: Device): [number, number][] => {
	const coords: [number, number][] = [];

	for (const { lon, lat } of tracks) {
		coords.push([lon ?? 0, lat ?? 0]);
	}

	return coords;
};

const patchDeviceData = (device: Device, values: Partial<Device>): Device => {
	return { ...device, ...values };
};
