import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		multi: vi.fn(),
	},
}));

import { redisClient } from '@config/redis/create-redis-client';
import { addDeviceBatchToRedis } from '@app/device/cache/add-device-batch-to-redis';
import { Device } from '@app/device/entity/device';

const TEST_KEY: string = 'test-key';

describe('add device batch to redis test', () => {
	const mockJsonSet = vi.fn();
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
		}

		expect(mockExec).toHaveBeenCalledOnce();
	});

	test("shouldn't be run when device batch is empty", async () => {
		const deviceBatch: Device[] = [];

		await addDeviceBatchToRedis(deviceBatch, TEST_KEY);

		expect(redisClient.multi).not.toHaveBeenCalled();
		expect(mockJsonSet).not.toHaveBeenCalled();
		expect(mockExec).not.toHaveBeenCalled();
	});
});
