import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@common/redis/create-redis-client', () => ({
	redisClient: {
		ft: {
			_list: vi.fn(),
			create: vi.fn(),
		},
	},
}));

vi.mock('@maur025/core-logger', () => ({
	loggerWarn: vi.fn(),
}));

import { redisClient } from '@common/redis/create-redis-client';
import { loggerWarn } from '@maur025/core-logger';
import { addRedisIdx } from '@common/redis/service/add-redis-idx';

describe('add redis idx test', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(redisClient.ft._list as Mock).mockResolvedValue([]);
	});

	test('should skip add when idx is falsy', async () => {
		await addRedisIdx('', {}, 'test');

		expect(loggerWarn).toHaveBeenCalledWith(
			`idx or prefix must not be undefined, skiping ...`,
		);
		expect(redisClient.ft._list).not.toHaveBeenCalled();
		expect(redisClient.ft.create).not.toHaveBeenCalled();
	});

	test('should skip add when prefix is falsy', async () => {
		await addRedisIdx('test-idx', {}, '');

		expect(loggerWarn).toHaveBeenCalledWith(
			`idx or prefix must not be undefined, skiping ...`,
		);
		expect(redisClient.ft._list).not.toHaveBeenCalled();
		expect(redisClient.ft.create).not.toHaveBeenCalled();
	});

	test('should skip when idx already exists', async () => {
		(redisClient.ft._list as Mock).mockResolvedValue(['test-idx']);

		await addRedisIdx('test-idx', {}, 'test');

		expect(loggerWarn).not.toHaveBeenCalled();
		expect(redisClient.ft._list).toHaveBeenCalledTimes(1);
		expect(redisClient.ft.create).not.toHaveBeenCalled();
	});

	test('should create a new idx when idx not exists', async () => {
		await addRedisIdx('test-idx', {}, 'test');

		expect(loggerWarn).not.toHaveBeenCalled();
		expect(redisClient.ft._list).toHaveBeenCalledTimes(1);
		expect(redisClient.ft.create).toHaveBeenCalledWith(
			'test-idx',
			expect.any(Object),
			expect.objectContaining({
				ON: 'JSON',
				PREFIX: 'test',
			}),
		);
	});
});
