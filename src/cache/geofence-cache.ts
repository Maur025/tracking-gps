import Geofence from '@models/entity/geofence';
import { singleton } from 'tsyringe';

@singleton()
export default class GeofenceCache {
	private geofenceList: Geofence[] = [];

	public readonly getAll = (): Geofence[] => {
		return [...this.geofenceList];
	};

	public readonly updateAll = (newGeofenceList: Geofence[]): void => {
		this.geofenceList = [...newGeofenceList];
	};

	public readonly clearCache = (): void => {
		this.geofenceList = [];
	};
}
