import { beforeEach, describe } from 'vitest';
import Geofence from '../../../src/models/entity/geofence';
import GeofenceCache from '../../../src/cache/geofence-cache';
import { container } from 'tsyringe';
import { cacheSingleCommonTest } from './cache-single-common-test';

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
