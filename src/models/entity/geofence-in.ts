import GeofenceData from './geofence-data';

/**
 * @deprecated GeofenceIn is deprecated, use schema version
 */
export default interface GeofenceIn {
	deviceId: string;
	geofenceId: string;
	geofenceName: string;
	section?: GeofenceData;
	sectionInternalId: string;
	isInside?: boolean;
	date?: string;
}
