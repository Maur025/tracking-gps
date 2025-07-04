import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		multi: vi.fn(),
	},
}));

import { redisClient } from '@config/redis/create-redis-client';
import { deleteDeviceCacheData } from '@app/device/cache/delete-device-cache-data';

const KEY_TEST: string = 'key-test:';

describe('delete device cache data test', () => {
	const mockDel = vi.fn();
	const mockExec = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		(redisClient.multi as Mock).mockReturnValue({
			del: mockDel,
			exec: mockExec,
		});
	});

	test('del should be run in base device batch size', async () => {
		const deviceKeyBatch: string[] = Array.from(
			{ length: 500 },
			(_, i) => `${KEY_TEST}${i}`,
		);

		await deleteDeviceCacheData(deviceKeyBatch);

		expect(redisClient.multi).toHaveBeenCalledOnce();
		expect(mockDel).toHaveBeenCalledTimes(500);

		for (const deviceKey of deviceKeyBatch) {
			expect(mockDel).toHaveBeenCalledWith(deviceKey);
		}

		expect(mockExec).toHaveBeenCalledOnce();
	});

	test('should not run when device batch is empty', async () => {
		const deviceKeyBatch: string[] = [];

		await deleteDeviceCacheData(deviceKeyBatch);

		expect(redisClient.multi).not.toHaveBeenCalled();
		expect(mockDel).not.toHaveBeenCalled();
		expect(mockExec).not.toHaveBeenCalled();
	});
});
