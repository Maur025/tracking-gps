import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@services/cache/device/add-device-batch-to-redis', () => ({
	addDeviceBatchToRedis: vi.fn().mockResolvedValue([1, 2, 3]),
}));

import { addDeviceBatchToRedis } from '@services/cache/device/add-device-batch-to-redis';
import DeviceCache from '@cache/device-cache';
import { container } from 'tsyringe';
import { addDeviceCacheData } from '@services/cache/device/add-device-cache-data';
import Device from '@models/entity/device';

describe('add device cache data test', () => {
	let deviceCacheMock: Partial<DeviceCache>;

	beforeAll(() => {
		const DeviceCacheMock = vi.fn();
		DeviceCacheMock.prototype.getRedisKey = vi.fn(() => 'key-test');

		deviceCacheMock = new DeviceCacheMock();
	});

	beforeEach(() => {
		vi.clearAllMocks();

		container.clearInstances();
		container.registerInstance(DeviceCache, deviceCacheMock);
	});

	test('should not call any function when param is empty', async () => {
		await addDeviceCacheData([]);

		expect(addDeviceBatchToRedis).not.toHaveBeenCalled();
		expect(deviceCacheMock.getRedisKey).not.toHaveBeenCalled();
	});

	test('should be execute once when device quantity is less to BATCH_LIMI 50', async () => {
		const deviceList = [{ id: 'device1' }] as Device[];
		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(1);
		expect(addDeviceBatchToRedis).toHaveBeenCalledOnce();
	});

	test('should be execute 2 times in 100 with devices', async () => {
		const deviceList = Array.from({ length: 100 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(2);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(0, 50),
			'key-test'
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(50, 100),
			'key-test'
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledTimes(2);
	});

	test('should execute 1 time more, when device quantity not is multiple of 50', async () => {
		const deviceList = Array.from({ length: 115 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(3);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(0, 50),
			'key-test'
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(50, 100),
			'key-test'
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(100, 115),
			'key-test'
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledTimes(3);
	});
});
