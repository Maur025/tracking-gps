import GeofenceCache from '@cache/geofence-cache';
import Track from '@models/entity/track';
import { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { SingleIoResponseBuilder } from '@maur025/core-model-data';
import DeviceCache from '@cache/device-cache';
import Device from '@models/entity/device';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

interface Request {
	deviceId: string;
	lastTrack: Track;
	socketServer: Socket;
}

const deviceCache = container.resolve(DeviceCache);
const geofenceCache = container.resolve(GeofenceCache);

export const geofenceVerify = ({
	deviceId,
	lastTrack,
	socketServer,
}: Request): void => {
	const { lon, lat } = lastTrack;

	const device: Device | undefined = deviceCache.getById(deviceId);

	if (!device) {
		return;
	}

	if (!geofenceCache.size()) {
		return;
	}

	for (const { data, name } of geofenceCache.getIterable()) {
		// console.log(geofence.name);
		if (!data) {
			return;
		}

		for (const { coords, type } of data) {
			if (type === 'POINTS') {
				continue;
			}

			const polygon = new Polygon(
				coords?.map(coord => {
					if (Array.isArray(coord)) {
						return coord.map(coordinate => {
							if (typeof coordinate == 'object') {
								return fromLonLat(coordinate as Coordinate);
							}
							return [];
						});
					}

					return [];
				}) ?? []
			);

			const isInside: boolean = polygon.intersectsCoordinate(
				fromLonLat([lon ?? 0, lat ?? 0])
			);

			console.log(
				`SE ENCUENTRA DENTRO O FUERA ${isInside} DE LA GEOCERCA ${name} en alguna seccion.`
			);
		}
	}
};
