import GeofenceIoResponse from './geofence-io-response';

export default interface GeofenceOutIoResponse {
	deviceId: string;
	geofences: GeofenceIoResponse[];
	isInside: boolean;
}
