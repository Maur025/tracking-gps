import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { container } from 'tsyringe';
import { emitGeofenceOut } from './geofence-out/emit-geofence-out';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';

interface Request {
	deviceId: string;
	geofenceInList: GeofenceIn[];
}

const geofenceInCache = container.resolve(GeofenceInCache);

/**
 * @deprecated it's marked, for possible useless
 */
export const syncGeofenceEventInCache = ({
	deviceId,
	geofenceInList,
}: Request): void => {
	const geofenceInCacheSet: Set<GeofenceIn> | undefined =
		geofenceInCache.getById(deviceId);

	if (!geofenceInCacheSet?.size && !geofenceInList?.length) {
		return;
	}

	if (!geofenceInCacheSet?.size && geofenceInList.length) {
		geofenceInCache.addById(deviceId, new Set(geofenceInList));

		return;
	}

	if (geofenceInCacheSet?.size && !geofenceInList.length) {
		console.log(
			'ANTES SE TENIA UN REGISTRO PERO AHORA NO EXISTE NADA EN LA LISTA ... SALIO DE UNA O TODAS LAS GEOCERCAS',
		);

		geofenceInCache.deleteById(deviceId);

		emitGeofenceOut({
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
			if (geofenceCache.id === geofenceIn.id) {
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
		geofenceInList.length < (geofenceInCacheSet?.size ?? 0)
	) {
		geofenceInCache.replaceById(deviceId, new Set(geofenceInList));
		console.log('LA LISTA ES MENOR ... SE ABANDONO ALGUNA GEOCERCA');

		emitGeofenceOut({
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
			geofenceInCache.getById(deviceId) ?? new Set(),
		);

		console.log(fullGeofenceInList);

		return;
	}

	console.log('EL DISPOSITIVO SE MANTIENE DENTRO DE LAS MISMAS GEOCERCAS');
};
