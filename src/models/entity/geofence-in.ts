import GeofenceData from './geofence-data';

export default interface GeofenceIn {
	deviceId: string;
	geofenceId: string;
	geofenceName: string;
	section?: GeofenceData;
	sectionInternalId: string;
	isInside?: boolean;
	date?: string;
}
