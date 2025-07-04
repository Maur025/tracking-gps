import { singleton } from 'tsyringe';
import AbstractSetCache from '../../../cache/abstract-set-cache';
import { GeofenceIn } from '../entity/geofence-in';

@singleton()
export default class GeofenceInCache extends AbstractSetCache<GeofenceIn> {
	private readonly geofenceInMap: Map<string, Set<GeofenceIn>> = new Map<
		string,
		Set<GeofenceIn>
	>();

	protected getMap(): Map<string, Set<GeofenceIn>> {
		return this.geofenceInMap;
	}

	protected getResource(): string {
		return 'Geofence In';
	}
}
