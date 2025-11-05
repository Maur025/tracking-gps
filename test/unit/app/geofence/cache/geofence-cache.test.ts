import { beforeEach, describe } from 'vitest';
import { container } from 'tsyringe';
import GeofenceCache from '@app/geofence/cache/geofence-cache.js';
import { Geofence } from '@app/geofence/entity/geofence.js';
import { cacheSingleCommonTest } from 'test/unit/common/cache/cache-single-common-test.js';

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

	cacheSingleCommonTest<Geofence>(cache, geofenceList as Geofence[]);
});
