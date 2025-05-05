import GeofenceCache from '@cache/geofence-cache';
import Track from '@models/entity/track';
import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';
import { getGeofenceInList } from './geofence/verify-in-out/get-geofence-in-list';
import { emitSocketResponse } from '@utils/emit-socket-response';
import GeofenceInIoResponse from '@models/dto/response/socket/geofence-in-io-response';
import { Topics } from '../../models/enums/topics.enum';
import GeofenceIn from '@models/entity/geofence-in';
import GeofenceIoResponse from '@models/dto/response/socket/geofence-io-response';
import GeofenceDataIoResponse from '@models/dto/response/socket/geofence-data-io-response';
import GeofenceInCache from '../../cache/geofence-in-cache';
import GeofenceOutIoResponse from '@models/dto/response/socket/geofence-out-io-response';
interface Request {
	deviceId: string;
	lastTrack: Track;
	ioServer: Server;
}

const { GEOFENCE_IN, GEOFENCE_OUT } = Topics;
const geofenceCache = container.resolve(GeofenceCache);
const geofenceInCache = container.resolve(GeofenceInCache);

export const geofenceVerify = ({
	deviceId,
	lastTrack,
	ioServer,
}: Request): void => {
	if (!geofenceCache.size()) {
		return;
	}

	const geofenceInList: GeofenceIn[] = getGeofenceInList({
		deviceId,
		lastTrack,
	});

	syncDataInCache(deviceId, ioServer, geofenceInList);
};

const syncDataInCache = (
	deviceId: string,
	ioServer: Server,
	geofenceInList: GeofenceIn[]
): void => {
	const geofenceInCacheSet: Set<GeofenceIn> | undefined =
		geofenceInCache.getById(deviceId);

	// console.log('DATOS EN CACHE: ', geofenceInCacheSet);

	if (!geofenceInCacheSet?.size && !geofenceInList?.length) {
		return;
	}

	if (!geofenceInCacheSet?.size && geofenceInList.length) {
		geofenceInCache.addById(deviceId, new Set(geofenceInList));

		emitGeofenceIn(deviceId, ioServer, geofenceInList);

		return;
	}

	if (geofenceInCacheSet?.size && !geofenceInList.length) {
		console.log(
			'ANTES SE TENIA UN REGISTRO PERO AHORA NO EXISTE NADA EN LA LISTA ... SALIO DE UNA O TODAS LAS GEOCERCAS'
		);

		geofenceInCache.deleteById(deviceId);

		emitGeofenceOut(ioServer);

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

		emitGeofenceOut(ioServer);

		return;
	}

	if (newGeofenceInList.length) {
		console.log('EL DISPOSITIVO ENTRO A NUEVAS GEOCERCAS');
		geofenceInCache.updateById(deviceId, new Set(newGeofenceInList));

		const fullGeofenceInList: GeofenceIn[] = Array.from(
			geofenceInCache.getById(deviceId) ?? new Set()
		);

		emitGeofenceIn(deviceId, ioServer, fullGeofenceInList);
		return;
	}

	console.log('EL DISPOSITIVO SE MANTIENE DENTRO DE LAS MISMAS GEOCERCAS');
};

const emitGeofenceIn = (
	deviceId: string,
	ioServer: Server,
	geofenceInList: GeofenceIn[]
) => {
	const geofenceInIoResponse: GeofenceInIoResponse = getGeofenceInIoResponse(
		deviceId,
		geofenceInList
	);

	const message = getGeofenceInMessage(geofenceInList);
	console.log(message);

	emitSocketResponse<GeofenceInIoResponse>({
		data: geofenceInIoResponse,
		ioServer: ioServer,
		eventType: GEOFENCE_IN,
		message,
	});
};

const getGeofenceInIoResponse = (
	deviceId: string,
	geofenceInList: GeofenceIn[]
): GeofenceInIoResponse => {
	const geofenceInIdList: string[] = geofenceInList.map(
		({ geofenceId }) => geofenceId
	);

	const geofenceInIdSet: Set<string> = new Set(geofenceInIdList);

	let geofenceIoResponseList: GeofenceIoResponse[] = [];

	for (const geofenceId of geofenceInIdSet) {
		let geofenceIoResponse: GeofenceIoResponse = {
			geofenceId,
			geofenceName: '',
			sections: [],
			isInside: true,
		};

		for (const { geofenceName, section } of geofenceInList) {
			if (!section) {
				continue;
			}

			const sections: GeofenceDataIoResponse[] = [
				...geofenceIoResponse.sections,
				section,
			];

			geofenceIoResponse = {
				...geofenceIoResponse,
				geofenceName,
				sections,
			};
		}

		geofenceIoResponseList = [...geofenceIoResponseList, geofenceIoResponse];
	}

	return {
		deviceId,
		geofences: geofenceIoResponseList,
		isInside: !geofenceIoResponseList.length,
	};
};

const emitGeofenceOut = (ioServer: Server): void => {
	emitSocketResponse<GeofenceOutIoResponse>({
		data: { name: 'test' },
		ioServer: ioServer,
		eventType: GEOFENCE_OUT,
		message: 'Salio de una geocerca',
	});
};

const getGeofenceInMessage = (geofenceInList: GeofenceIn[]): string => {
	if (!geofenceInList.length) {
		return 'El dispositivo no se encuentra dentro de ninguna geocerca.';
	}

	let messageIn: string = '';
	let index: number = 0;
	for (const { geofenceName, section } of geofenceInList) {
		index++;
		messageIn += `${geofenceName}/seccion ${section?.name ?? 'Sin Nombre'}`;

		if (index !== geofenceInList.length) {
			messageIn += ', ';
		}
	}

	return `El dispositivo se encuentra dentro de la(s) geocerca(s): ${messageIn}`;
};
