import GeofenceDataIoResponse from './geofence-data-io-response';

export default interface GeofenceIoResponse {
	geofenceId: string;
	geofenceName: string;
	sections: GeofenceDataIoResponse[];
}
