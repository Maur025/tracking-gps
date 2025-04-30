import { describe, test, beforeEach, expect } from 'vitest';
import { container } from 'tsyringe';
import DeviceCache from '../../../src/cache/device-cache';
import Device from '../../../src/models/entity/device';

describe('Device Cache Tests', () => {
	const deviceList: Partial<Device>[] = [
		{ id: '1', isReady: true },
		{ id: '2', isReady: false },
		{ id: '3', isReady: false },
		{ id: '4', isReady: true },
	];

	let cache: DeviceCache;

	beforeEach(() => {
		cache = container.resolve(DeviceCache);
		cache.clear();
	});

	test('test getAll in new instance should be equal empty', () => {
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	test('test addMany should add batch of devices to cache', () => {
		cache.addMany(deviceList);

		const result: number = cache.size();

		expect(result).toBeDefined();
		expect(result).toBe(deviceList.length);
	});

	test('test clear should clear device cache', () => {
		cache.addMany(deviceList);
		const sizeBefore: number = cache.size();

		expect(sizeBefore).toBeDefined();
		expect(sizeBefore).toBe(deviceList.length);

		cache.clear();

		const result: number = cache.size();
		expect(result).toBeDefined();
		expect(result).toBe(0);
	});

	test('test getAll should return a inmutable objects', () => {
		cache.addMany(deviceList);

		const original = cache.getAll();
		const copy = cache.getAll();

		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
	});
});
