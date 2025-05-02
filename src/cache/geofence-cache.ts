import Geofence from '@models/entity/geofence';
import { singleton } from 'tsyringe';
import AbstractSingleCache from './abstract-single-cache';

@singleton()
export default class GeofenceCache extends AbstractSingleCache<Geofence> {
	private geofenceMap: Map<string, Geofence> = new Map<string, Geofence>();

	protected getMap(): Map<string, Geofence> {
		return this.geofenceMap;
	}

	protected getResource(): string {
		return 'Geofence';
	}
}
