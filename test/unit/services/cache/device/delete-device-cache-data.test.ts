import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		del: vi.fn(),
	},
}));

import { redisClient } from '@config/redis/create-redis-client';
import { deleteDeviceCacheData } from '@services/cache/device/delete-device-cache-data';

const KEY_TEST: string = 'key-test:';

describe('delete device cache data test', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('del should be run in base device batch size', async () => {
		const deviceKeyBatch: string[] = Array.from(
			{ length: 50 },
			(_, i) => `${KEY_TEST}${i}`
		);

		await deleteDeviceCacheData(deviceKeyBatch);

		expect(redisClient.del).toHaveBeenCalledTimes(50);

		for (const deviceKey of deviceKeyBatch) {
			expect(redisClient.del).toHaveBeenCalledWith(deviceKey);
		}
	});

	test('should not run when device batch is empty', async () => {
		const deviceKeyBatch: string[] = [];

		await deleteDeviceCacheData(deviceKeyBatch);

		expect(redisClient.del).not.toHaveBeenCalled();
	});
});
