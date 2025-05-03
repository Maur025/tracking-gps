import GeofenceDataIoResponse from './geofence-data-io-response';
import GeofenceIoResponse from './geofence-io-response';

export default interface GeofenceInIoResponse {
	deviceId: string;
	geofences: GeofenceIoResponse[];
	isInside?: boolean;
}
