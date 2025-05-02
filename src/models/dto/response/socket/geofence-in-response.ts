import GeofenceData from '@models/entity/geofence-data';

export default interface GeofenceInResponse {
	deviceId: string;
	geofenceId: string;
	section?: GeofenceData;
	isInside?: boolean;
}
