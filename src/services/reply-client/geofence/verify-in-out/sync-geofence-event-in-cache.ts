import GeofenceInCache from '@cache/geofence-in-cache';
import GeofenceIn from '@models/entity/geofence-in';
import { Server } from 'socket.io';
import { container } from 'tsyringe';
import { emitGeofenceIn } from './geofence-in/emit-geofence-in';
import { emitGeofenceOut } from './geofence-out/emit-geofence-out';

interface Request {
	deviceId: string;
	ioServer: Server;
	geofenceInList: GeofenceIn[];
}

const geofenceInCache = container.resolve(GeofenceInCache);

export const syncGeofenceEventInCache = ({
	deviceId,
	ioServer,
	geofenceInList,
}: Request): void => {
	const geofenceInCacheSet: Set<GeofenceIn> | undefined =
		geofenceInCache.getById(deviceId);

	if (!geofenceInCacheSet?.size && !geofenceInList?.length) {
		return;
	}

	if (!geofenceInCacheSet?.size && geofenceInList.length) {
		geofenceInCache.addById(deviceId, new Set(geofenceInList));

		emitGeofenceIn({ deviceId, ioServer, geofenceInList });

		return;
	}

	if (geofenceInCacheSet?.size && !geofenceInList.length) {
		console.log(
			'ANTES SE TENIA UN REGISTRO PERO AHORA NO EXISTE NADA EN LA LISTA ... SALIO DE UNA O TODAS LAS GEOCERCAS'
		);

		geofenceInCache.deleteById(deviceId);

		emitGeofenceOut({
			ioServer,
			deviceId,
			geofenceInOldSet: geofenceInCacheSet,
			geofenceInCurrentList: geofenceInList,
		});

		return;
	}

	let newGeofenceInList: GeofenceIn[] = [];

	for (const geofenceIn of geofenceInList) {
		let isExist: boolean = false;

		for (const geofenceCache of geofenceInCacheSet?.values() ?? []) {
			if (geofenceCache.sectionInternalId === geofenceIn.sectionInternalId) {
				isExist = true;
				break;
			}
		}

		if (!isExist) {
			newGeofenceInList = [...newGeofenceInList, geofenceIn];
		}
	}

	if (
		!newGeofenceInList.length &&
		geofenceInList.length < geofenceInCacheSet?.size!
	) {
		geofenceInCache.replaceById(deviceId, new Set(geofenceInList));
		console.log('LA LISTA ES MENOR ... SE ABANDONO ALGUNA GEOCERCA');

		emitGeofenceOut({
			ioServer,
			deviceId,
			geofenceInOldSet: geofenceInCacheSet,
			geofenceInCurrentList: geofenceInList,
		});

		return;
	}

	if (newGeofenceInList.length) {
		console.log('EL DISPOSITIVO ENTRO A NUEVAS GEOCERCAS');
		geofenceInCache.updateById(deviceId, new Set(newGeofenceInList));

		const fullGeofenceInList: GeofenceIn[] = Array.from(
			geofenceInCache.getById(deviceId) ?? new Set()
		);

		emitGeofenceIn({ deviceId, ioServer, geofenceInList: fullGeofenceInList });
		return;
	}

	console.log('EL DISPOSITIVO SE MANTIENE DENTRO DE LAS MISMAS GEOCERCAS');
};
