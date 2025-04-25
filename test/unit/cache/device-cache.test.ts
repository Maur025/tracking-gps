import { describe, test, beforeEach, expect } from 'vitest';
import { container } from 'tsyringe';
import DeviceCache from '../../../src/cache/device-cache';
import Device from '../../../src/models/entity/device';

describe('Device Cache Tests', () => {
	const deviceList: Partial<Device>[] = [
		{
			isReady: true,
		},
		{ isReady: false },
		{ isReady: false },
		{ isReady: true },
	];

	let cache: DeviceCache;

	beforeEach(() => {
		cache = container.resolve(DeviceCache);
		cache.clearCache();
	});

	test('test new instance should be equal empty', () => {
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	test('test updateAll should add new device list', () => {
		cache.updateAll(deviceList);
		const result = cache.getAll();

		expect(result).toBeDefined();
		expect(result).toHaveLength(deviceList.length);
	});

	test('test clearList should clear device cache', () => {
		cache.updateAll(deviceList);
		const beforeResult = cache.getAll();
		expect(beforeResult).toBeDefined();
		expect(beforeResult).toHaveLength(deviceList.length);

		cache.clearCache();

		const result = cache.getAll();
		expect(result).toBeDefined();
		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});

	test('test getAll should return a new array copy', () => {
		cache.updateAll(deviceList);

		const original = cache.getAll();
		const copy = cache.getAll();

		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
	});
});
