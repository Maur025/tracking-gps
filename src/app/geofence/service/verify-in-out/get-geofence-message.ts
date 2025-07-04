import { GeofenceIn } from '@app/geofence/entity/geofence-in';

const getGeofenceMessage =
	(type: 'IN' | 'OUT') =>
	(geofenceInOutList: GeofenceIn[]): string => {
		if (!geofenceInOutList.length) {
			return 'Se desconoce si el dispositivo interactuo con alguna geocerca.';
		}

		const messageIn: string = geofenceInOutList
			.map(
				({ geofenceName, section }) =>
					`${geofenceName}/seccion ${section?.name ?? 'Sin nombre'}`,
			)
			.join(', ');

		return `El dispositivo ${
			type === 'IN' ? 'se encuentra dentro' : 'salio'
		} de la(s) geocerca(s): ${messageIn}`;
	};

export const getGeofenceInMessage = getGeofenceMessage('IN');
export const getGeofenceOutMessage = getGeofenceMessage('OUT');
