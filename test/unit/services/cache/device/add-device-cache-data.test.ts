import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@services/cache/device/add-device-batch-to-redis', () => ({
	addDeviceBatchToRedis: vi.fn().mockResolvedValue([1, 2, 3]),
}));

vi.mock('@services/redis/add-redis-idx', () => ({
	addRedisIdx: vi.fn(),
}));

import { addDeviceBatchToRedis } from '@services/cache/device/add-device-batch-to-redis';
import DeviceCache from '@cache/device-cache';
import { container } from 'tsyringe';
import { addDeviceCacheData } from '@services/cache/device/add-device-cache-data';
import Device from '@models/entity/device';
import { addRedisIdx } from '@services/redis/add-redis-idx';

describe('add device cache data test', () => {
	let deviceCacheMock: Partial<DeviceCache>;

	beforeAll(() => {
		const DeviceCacheMock = vi.fn();
		DeviceCacheMock.prototype.getRedisKey = vi.fn(() => 'key-test');
		DeviceCacheMock.prototype.getIdxData = vi.fn(() => 'idx-test');

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

	test('should be execute once when device quantity is less to BATCH_LIMI 500', async () => {
		const deviceList = [{ id: 'device1' }] as Device[];
		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(2);
		expect(addDeviceBatchToRedis).toHaveBeenCalledOnce();
		expect(addRedisIdx).toHaveBeenCalledTimes(1);
		expect(addRedisIdx).toHaveBeenCalledWith(
			'idx-test',
			expect.any(Object),
			'key-test',
		);
	});

	test('should be execute 2 times with 1000 devices', async () => {
		const deviceList = Array.from({ length: 1000 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(3);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(0, 500),
			'key-test',
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(500, 1000),
			'key-test',
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledTimes(2);
		expect(addRedisIdx).toHaveBeenCalledWith(
			'idx-test',
			expect.any(Object),
			'key-test',
		);
	});

	test('should execute 1 time more, when device quantity not is multiple of 500', async () => {
		const deviceList = Array.from({ length: 1150 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceCacheData(deviceList);

		expect(deviceCacheMock.getRedisKey).toHaveBeenCalledTimes(4);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(0, 500),
			'key-test',
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(500, 1000),
			'key-test',
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledWith(
			deviceList.slice(1000, 1150),
			'key-test',
		);

		expect(addDeviceBatchToRedis).toHaveBeenCalledTimes(3);

		expect(addRedisIdx).toHaveBeenCalledWith(
			'idx-test',
			expect.any(Object),
			'key-test',
		);
	});
});
