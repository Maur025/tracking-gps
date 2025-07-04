import GeofenceDataIoResponse from './geofence-data-io-response';

/**
 * @deprecated GeofenceIoResponse is deprecated, use schema version
 */
export default interface GeofenceIoResponse {
	geofenceId: string;
	geofenceName: string;
	sections: GeofenceDataIoResponse[];
}
