import { beforeEach, describe } from 'vitest';
import { container } from 'tsyringe';
import { cacheSingleCommonTest } from '../../../cache/cache-single-common-test';
import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { Geofence } from '@app/geofence/entity/geofence';

describe('Geofence Cache tests', () => {
	const geofenceList: Partial<Geofence>[] = [
		{ id: '1', name: 'geofence 1' },
		{ id: '2', name: 'geofence 2' },
		{ id: '3', name: 'geofence 3' },
		{ id: '4', name: 'geofence 4' },
	];

	const cache: GeofenceCache = container.resolve(GeofenceCache);

	beforeEach(() => {
		cache.clear();
	});

	cacheSingleCommonTest<Geofence>(cache, geofenceList);
});
