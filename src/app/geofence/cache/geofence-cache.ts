import { singleton } from 'tsyringe';
import { Geofence } from '@app/geofence/entity/geofence';
import AbstractSingleCache from '@common/cache/abstract-single-cache';

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
