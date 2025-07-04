import GeofenceIoResponse from './geofence-io-response';

export default interface GeofenceInIoResponse {
	deviceId: string;
	geofences: GeofenceIoResponse[];
	isInside?: boolean;
}
