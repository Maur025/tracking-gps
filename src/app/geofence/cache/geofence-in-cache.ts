import { singleton } from 'tsyringe';
import { GeofenceIn } from '../entity/geofence-in';
import AbstractSetCache from '@common/cache/abstract-set-cache';

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
