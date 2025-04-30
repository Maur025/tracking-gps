import { beforeEach, describe, expect, test } from 'vitest';
import Geofence from '../../../src/models/entity/geofence';
import GeofenceCache from '../../../src/cache/geofence-cache';
import { container } from 'tsyringe';

describe('Geofence Cache tests', () => {
	const geofenceList: Partial<Geofence>[] = [
		{ id: '1', name: 'geofence 1' },
		{ id: '2', name: 'geofence 2' },
		{ id: '3', name: 'geofence 3' },
		{ id: '4', name: 'geofence 4' },
	];

	let cache: GeofenceCache;

	beforeEach(() => {
		cache = container.resolve(GeofenceCache);
		cache.clear();
	});

	test('test getAll in new instance should return empty array', () => {
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	test('test addMany should add batch of geofences to cache', () => {
		cache.addMany(geofenceList);

		const result: number = cache.size();

		expect(result).toBeDefined();
		expect(result).toBe(geofenceList.length);
	});

	test('test addMany should skip objects without id', () => {
		const geofenceLocalList: Partial<Geofence>[] = [
			{ name: 'geo 1' },
			{ name: 'geo 2' },
			{ id: '3', name: 'geo 3' },
		];

		cache.addMany(geofenceLocalList);

		const result: number = cache.size();

		expect(result).toBeDefined();
		expect(result).not.toBe(geofenceLocalList.length);
		expect(result).toBe(1);
	});

	test('test clear should clear geofence cache', () => {
		cache.addMany(geofenceList);
		const sizeBefore: number = cache.size();

		expect(sizeBefore).toBeDefined();
		expect(sizeBefore).toBe(geofenceList.length);

		cache.clear();

		const result: number = cache.size();

		expect(result).toBeDefined();
		expect(result).toBe(0);
	});

	test('test getAll should return a immutable objects', () => {
		cache.addMany(geofenceList);

		const original: Geofence[] = cache.getAll();
		const copy: Geofence[] = cache.getAll();

		expect(original).toEqual(copy);
		expect(original).not.toBe(copy);
	});

	test('test getById should return a immutable object', () => {
		cache.addMany(geofenceList);

		const original: Geofence | undefined = cache.getById('1');
		const copy: Geofence | undefined = cache.getById('1');

		expect(original).toBeDefined();
		expect(copy).toBeDefined();

		expect(original).toEqual(copy);
		expect(original).not.toBe(copy);
	});

	test('test addById should add a new element in cache', () => {
		const geofence: Partial<Geofence> = { id: '5', name: 'geofence 5' };
		cache.addById('5', geofence);

		const result: number = cache.size();
		const dataInCache: Geofence = cache.getById('5');

		expect(result).toBeDefined();
		expect(result).toBe(1);
		expect(dataInCache).toBeDefined();
		expect(dataInCache).toEqual(geofence);
	});

	test('test addById should skip if value exist', () => {
		cache.addMany(geofenceList);
		const geofence: Partial<Geofence> = { id: '1', name: 'new geofence 1' };

		cache.addById('1', geofence);

		const result: number = cache.size();
		const dataInCache: Geofence = cache.getById('1');

		expect(result).toBeDefined();
		expect(result).toBe(geofenceList.length);

		expect(dataInCache).toBeDefined();
		expect(dataInCache.name).not.toBe(geofence.name);
	});

	test('test updateById should replace or add attributes to objects', () => {
		cache.addMany(geofenceList);

		const geofence: Partial<Geofence> = { deleted: true };
		cache.updateById('1', geofence);

		const result: Geofence | undefined = cache.getById('1');

		expect(result).toBeDefined();
		expect(result!.deleted).toBeDefined();
		expect(result!.deleted).toBeTruthy();
	});

	test('test updateById should skip in unknown id', () => {
		cache.addMany(geofenceList);

		const geofence: Partial<Geofence> = { deleted: true };
		cache.updateById('10', geofence);

		const result: Geofence | undefined = cache.getById('10');
		const size: number = cache.size();

		expect(result).toBeUndefined();
		expect(size).toBeDefined();
		expect(size).toBe(geofenceList.length);
	});

	test('test updateMany should skip objects without id', () => {
		cache.addMany(geofenceList);

		const geofenceLocalList: Partial<Geofence>[] = [
			{ name: 'geo 1' },
			{ name: 'geo 2' },
			{ id: '3', name: 'geofence updated!!!' },
		];

		cache.updateMany(geofenceLocalList);

		const result: number = cache.size();
		const dataInCache: Geofence | undefined = cache.getById('3');

		expect(result).toBeDefined();
		expect(result).toBe(geofenceList.length);

		expect(dataInCache).toBeDefined();
		expect(dataInCache!.name).toBe('geofence updated!!!');
	});

	test('test deleteById should remove element in cache', () => {
		cache.addMany(geofenceList);

		cache.deleteById('3');

		const result: Geofence | undefined = cache.getById('3');
		const size: number = cache.size();

		expect(size).toBeDefined();
		expect(size).not.toBe(geofenceList.length);
		expect(size).toBe(3);

		expect(result).toBeUndefined();
	});
});
