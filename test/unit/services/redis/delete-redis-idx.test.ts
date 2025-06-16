import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		ft: { _list: vi.fn().mockResolvedValue([]), dropIndex: vi.fn() },
	},
}));

import { redisClient } from '@config/redis/create-redis-client';
import { deleteRedisIdx } from '@services/redis/delete-redis-idx';

describe('delete redis idx test', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should not execute nothing when idx params is falsy', async () => {
		await deleteRedisIdx('');

		expect(redisClient.ft._list).not.toHaveBeenCalled();
		expect(redisClient.ft.dropIndex).not.toHaveBeenCalled();
	});

	test('should not execute drop when idx not initialized', async () => {
		await deleteRedisIdx('test-idx');

		expect(redisClient.ft._list).toHaveBeenCalledTimes(1);
		expect(redisClient.ft.dropIndex).not.toHaveBeenCalled();
	});

	test('should drop idx when its initialized', async () => {
		(redisClient.ft._list as Mock).mockResolvedValue(['test-idx']);

		await deleteRedisIdx('test-idx');

		expect(redisClient.ft._list).toHaveBeenCalledTimes(1);
		expect(redisClient.ft.dropIndex).toHaveBeenCalledTimes(1);
		expect(redisClient.ft.dropIndex).toHaveBeenCalledWith(
			'test-idx',
			expect.any(Object)
		);
	});
});
