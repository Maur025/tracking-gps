import { beforeEach, describe, expect, test } from 'vitest';
import Geofence from '../../../src/models/entity/geofence';
import GeofenceCache from '../../../src/cache/geofence-cache';
import { container } from 'tsyringe';

describe('Geofence Cache tests', () => {
	const geofenceList: Partial<Geofence>[] = [
		{ name: 'geofence 1' },
		{ name: 'geofence 2' },
		{ name: 'geofence 3' },
		{ name: 'geofence 4' },
	];

	let cache: GeofenceCache;

	beforeEach(() => {
		cache = container.resolve(GeofenceCache);
		cache.clearCache();
	});

	test('test new instance should return empty array', () => {
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	test('test updateAll should add new geofence list', () => {
		cache.updateAll(geofenceList);
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(geofenceList.length);
	});

	test('test clearList should clear device cache', () => {
		cache.updateAll(geofenceList);
		const before = cache.getAll();

		expect(before).toBeDefined();
		expect(before).toHaveLength(geofenceList.length);

		cache.clearCache();

		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});
});
