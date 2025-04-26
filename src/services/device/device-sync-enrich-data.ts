import Device from '@models/entity/device';
import { processByLastTrackIdDefined } from './process-last-track-id-defined';
import { processByLasTrackIdEqualZero } from './process-last-track-id-equal-zero';
import { processOnRouteEqualOne } from './process-on-route-equal-one';
import {
	catchError,
	from,
	lastValueFrom,
	mergeMap,
	Observable,
	of,
} from 'rxjs';
import { loggerError } from '@utils/logger';

export const syncAndEnrichDevices = async (
	devices: Device[]
): Promise<Device[]> => {
	const deviceList: Device[] = [...devices];

	if (deviceList.length) {
		await lastValueFrom(
			from(deviceList).pipe(
				mergeMap(
					device =>
						syncDevice(device).pipe(
							catchError(error => {
								loggerError(`Error syncing device ${device.id}`, error);
								return of();
							})
						),
					20
				)
			)
		);
	}

	return deviceList;
};

const syncDevice = (device: Device): Observable<unknown> => {
	const { states } = device;

	if (states?.ON_ROUTE === '1') {
		return processOnRouteEqualOne(device);
	}

	if (!states?.LAST_TRACK_ID) {
		return of();
	}

	if (states?.LAST_TRACK_ID === '0') {
		return processByLasTrackIdEqualZero(device);
	}

	return processByLastTrackIdDefined(device);
};
