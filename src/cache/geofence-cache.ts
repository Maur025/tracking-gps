import Geofence from '@models/entity/geofence';
import { singleton } from 'tsyringe';
import AbstractCache from './abstract-cache';

@singleton()
export default class GeofenceCache extends AbstractCache<Geofence> {
	private geofenceMap: Map<string, Geofence> = new Map<string, Geofence>();

	protected getMap(): Map<string, Geofence> {
		return this.geofenceMap;
	}

	protected getResource(): string {
		return 'Geofence';
	}
}
