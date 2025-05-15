import { loggerError } from '@maur025/core-logger';
import Device from '@models/entity/device';

import {
	catchError,
	from,
	lastValueFrom,
	mergeMap,
	Observable,
	of,
} from 'rxjs';

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
								return of([]);
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

	return of([]);

	// REFACTORIZAR O QUITAR SI NO LLEGA A NECESITARSE
	// CON LA ULTIMA ACTUALIZACION DE CAPTURE, PRODUCE ERRORES
	// if (!states) {
	// 	return of();
	// }

	// if (states?.ON_ROUTE === '1') {
	// 	return processOnRouteEqualOne(device);
	// }

	// if (!states?.LAST_TRACK_ID) {
	// 	return of();
	// }

	// if (states?.LAST_TRACK_ID === '0') {
	// 	return processByLasTrackIdEqualZero(device);
	// }

	// return processByLastTrackIdDefined(device);
};
