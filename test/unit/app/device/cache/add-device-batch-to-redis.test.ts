import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@common/redis/create-redis-client', () => ({
	redisClient: {
		multi: vi.fn(),
	},
}));

import { redisClient } from '@common/redis/create-redis-client.js';
import { addDeviceBatchToRedis } from '@app/device/cache/add-device-batch-to-redis.js';
import { Device } from '@app/device/entity/device.js';

const TEST_KEY: string = 'test-key';

describe('add device batch to redis test', () => {
	const mockJsonSetExpire = vi.fn();
	const mockJsonSet = vi.fn(() => ({
		expire: mockJsonSetExpire,
	}));

	const mockExec = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		(redisClient.multi as Mock).mockReturnValue({
			json: { set: mockJsonSet },
			exec: mockExec,
		});
	});

	test('hSet should be run based on the device batch size', async () => {
		const deviceBatch = Array.from({ length: 500 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceBatchToRedis(deviceBatch, TEST_KEY);

		expect(redisClient.multi).toHaveBeenCalledOnce();
		expect(mockJsonSet).toHaveBeenCalledTimes(500);

		for (let index = 0; index < 500; index++) {
			expect(mockJsonSet).toHaveBeenCalledWith(
				`${TEST_KEY}id${index}`,
				'$',
				expect.any(Object),
			);
			expect(mockJsonSetExpire).toHaveBeenCalledWith(
				`${TEST_KEY}id${index}`,
				3600,
			);
		}

		expect(mockExec).toHaveBeenCalledOnce();
	});

	test("shouldn't be run when device batch is empty", async () => {
		const deviceBatch: Device[] = [];

		await addDeviceBatchToRedis(deviceBatch, TEST_KEY);

		expect(redisClient.multi).not.toHaveBeenCalled();
		expect(mockJsonSet).not.toHaveBeenCalled();
		expect(mockJsonSetExpire).not.toHaveBeenCalled();
		expect(mockExec).not.toHaveBeenCalled();
	});
});
