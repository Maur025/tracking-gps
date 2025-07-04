import { describe, beforeEach, test, expect, vi, Mock } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		scanIterator: vi.fn(),
	},
}));

vi.mock('@maur025/core-logger', () => ({
	loggerInfo: vi.fn(),
	loggerError: vi.fn(),
	loggerWarn: vi.fn(),
}));

vi.mock('@app/device/cache/delete-device-cache-data', () => ({
	deleteDeviceCacheData: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@app/device/cache/get-device-batch-from-redis', () => ({
	getDeviceBatchFromRedis: vi.fn().mockResolvedValue([]),
}));

import { container } from 'tsyringe';
import { cacheSingleCommonTest } from '../../../cache/cache-single-common-test';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { redisClient } from '@config/redis/create-redis-client';
import { deleteDeviceCacheData } from '@app/device/cache/delete-device-cache-data';
import { getDeviceBatchFromRedis } from '@app/device/cache/get-device-batch-from-redis';
import { Device } from '@app/device/entity/device';
import DeviceCache from '@app/device/cache/device-cache';

describe('Device Cache Tests', () => {
	const deviceList = [
		{ id: '1', isReady: true },
		{ id: '2', isReady: false },
		{ id: '3', isReady: false },
		{ id: '4', isReady: true },
	] as Device[];

	const cache: DeviceCache = container.resolve(DeviceCache);

	const fakeAsyncGenerator = async function* () {
		yield ['key1', 'key2'];
		yield ['key3'];
	};

	beforeEach(() => {
		vi.clearAllMocks();

		cache.clear();

		(redisClient.scanIterator as Mock).mockReturnValue(fakeAsyncGenerator());
	});

	cacheSingleCommonTest<Device>(cache, deviceList);

	test('getKeysAndProcess should run scan in redis and execute callback', async () => {
		const testKeys: string[] = [];

		await cache.getKeysAndProcess(async keyList => {
			for await (const key of keyList) {
				testKeys.push(...key);
			}

			loggerInfo(`Hello World your keys: ${testKeys}`);
		});

		expect(redisClient.scanIterator).toHaveBeenCalledTimes(1);
		expect(loggerInfo).toHaveBeenCalledWith(
			'Hello World your keys: key1,key2,key3',
		);
		expect(loggerError).not.toHaveBeenCalled();
	});

	test('getKeysAndProcess should catch error of redis and showing logger error', async () => {
		(redisClient.scanIterator as Mock).mockImplementationOnce(() => {
			throw new Error('Redis failed');
		});

		await cache.getKeysAndProcess(async () => {
			loggerInfo('Hello world');
		}, 'testing');

		expect(loggerError).toHaveBeenCalledWith(
			`can't process operation testing cache data in redis cause: `,
			expect.any(Error),
		);

		expect(loggerInfo).not.toHaveBeenCalled();
	});

	test('clearCacheData should delete run once when size is less to 500', async () => {
		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(1);
	});

	test('clearCacheData should delete run 2 times when size is 1000', async () => {
		vi.clearAllMocks();

		const testFakeAsyncGenerator = async function* () {
			yield Array.from({ length: 700 }, (_, i) => `key:${i}`);
			yield Array.from({ length: 300 }, (_, i) => `key:${i + 700}`);
		};
		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator(),
		);

		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(2);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i}`)),
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i + 500}`)),
		);
	});

	test('clearCacheData should delete run 3 times when size is 1150', async () => {
		vi.clearAllMocks();

		const testFakeAsyncGenerator = async function* () {
			yield Array.from({ length: 800 }, (_, i) => `key:${i}`);
			yield Array.from({ length: 350 }, (_, i) => `key:${i + 800}`);
		};
		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator(),
		);

		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(3);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i}`)),
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i + 500}`)),
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			3,
			expect.arrayContaining([...Array(150)].map((_, i) => `key:${i + 1000}`)),
		);
	});

	test('loadCacheData should clear previus data before adding the new data', async () => {
		cache.addMany(deviceList);
		const deviceInCache = cache.getAll();

		await cache.loadCacheData();

		const deviceInCacheAfterExecuting = cache.getAll();

		expect(deviceInCache).toBeDefined();
		expect(deviceInCache.length).toBeGreaterThan(0);

		expect(deviceInCacheAfterExecuting).toBeDefined();
		expect(deviceInCacheAfterExecuting.length).toBe(0);
	});

	test('loadCacheData should run once when size is less to 500', async () => {
		await cache.loadCacheData();

		expect(getDeviceBatchFromRedis).toHaveBeenCalledOnce();
	});

	test('loadCacheData should run 2 times when key size is 1000', async () => {
		vi.clearAllMocks();

		const testFakeAsyncGenerator = async function* () {
			yield Array.from({ length: 550 }, (_, i) => `key:${i}`);
			yield Array.from({ length: 325 }, (_, i) => `key:${i + 550}`);
			yield Array.from({ length: 125 }, (_, i) => `key:${i + 875}`);
		};

		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator(),
		);

		await cache.loadCacheData();

		expect(getDeviceBatchFromRedis).toHaveBeenCalledTimes(2);

		expect(getDeviceBatchFromRedis).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i}`)),
		);

		expect(getDeviceBatchFromRedis).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i + 500}`)),
		);
	});

	test('loadCacheData should run 3 times when key batch size 1150', async () => {
		vi.clearAllMocks();

		const testFakeAsyncGenerator = async function* () {
			yield [...Array(400)].map((_, i) => `key:${i}`);
			yield [...Array(250)].map((_, i) => `key:${i + 400}`);
			yield [...Array(150)].map((_, i) => `key:${i + 650}`);
			yield [...Array(350)].map((_, i) => `key:${i + 800}`);
		};

		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator(),
		);

		await cache.loadCacheData();

		expect(getDeviceBatchFromRedis).toHaveBeenCalledTimes(3);

		expect(getDeviceBatchFromRedis).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i}`)),
		);

		expect(getDeviceBatchFromRedis).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(500)].map((_, i) => `key:${i + 500}`)),
		);

		expect(getDeviceBatchFromRedis).toHaveBeenNthCalledWith(
			3,
			expect.arrayContaining([...Array(150)].map((_, i) => `key:${i + 1000}`)),
		);
	});
});
