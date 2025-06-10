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

vi.mock('@services/cache/device/delete-device-cache-data', () => ({
	deleteDeviceCacheData: vi.fn().mockResolvedValue(undefined),
}));

import { container } from 'tsyringe';
import DeviceCache from '../../../src/cache/device-cache';
import Device from '../../../src/models/entity/device';
import { cacheSingleCommonTest } from './cache-single-common-test';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { redisClient } from '@config/redis/create-redis-client';
import { deleteDeviceCacheData } from '@services/cache/device/delete-device-cache-data';

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
			'Hello World your keys: key1,key2,key3'
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
			expect.any(Error)
		);

		expect(loggerInfo).not.toHaveBeenCalled();
	});

	test('clearCacheData should delete run once when size is less to 50', async () => {
		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(1);
	});

	test('clearCacheData should delete run 2 times when size is 100', async () => {
		const testFakeAsyncGenerator = async function* () {
			yield Array.from({ length: 70 }, (_, i) => `key:${i}`);
			yield Array.from({ length: 30 }, (_, i) => `key:${i + 70}`);
		};
		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator()
		);

		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(2);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(50)].map((_, i) => `key:${i}`))
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(50)].map((_, i) => `key:${i + 50}`))
		);
	});

	test('clearCacheData should delete run 3 times when size is 115', async () => {
		const testFakeAsyncGenerator = async function* () {
			yield Array.from({ length: 80 }, (_, i) => `key:${i}`);
			yield Array.from({ length: 35 }, (_, i) => `key:${i + 80}`);
		};
		(redisClient.scanIterator as Mock).mockReturnValue(
			testFakeAsyncGenerator()
		);

		await cache.clearCacheData();

		expect(deleteDeviceCacheData).toHaveBeenCalledTimes(3);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			1,
			expect.arrayContaining([...Array(50)].map((_, i) => `key:${i}`))
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			2,
			expect.arrayContaining([...Array(50)].map((_, i) => `key:${i + 50}`))
		);

		expect(deleteDeviceCacheData).toHaveBeenNthCalledWith(
			3,
			expect.arrayContaining([...Array(15)].map((_, i) => `key:${i + 100}`))
		);
	});
});
