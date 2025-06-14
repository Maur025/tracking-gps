import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@config/redis/create-redis-client', () => ({
	redisClient: {
		json: {
			set: vi.fn(),
		},
	},
}));

import { redisClient } from '@config/redis/create-redis-client';
import Device from '@models/entity/device';
import { addDeviceBatchToRedis } from '@services/cache/device/add-device-batch-to-redis';

const TEST_KEY: string = 'test-key';

describe('add device batch to redis test', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('hSet should be run based on the device batch size', async () => {
		const deviceBatch = Array.from({ length: 50 }, (_, i) => ({
			id: `id${i}`,
		})) as Device[];

		await addDeviceBatchToRedis(deviceBatch, TEST_KEY);

		expect(redisClient.json.set).toHaveBeenCalledTimes(50);

		for (let index = 0; index < 50; index++) {
			expect(redisClient.json.set).toHaveBeenCalledWith(
				`${TEST_KEY}id${index}`,
				'$',
				expect.any(Object)
			);
		}
	});

	test("shouldn't be run when device batch is empty", async () => {
		const deviceBatch: Device[] = [];

		await addDeviceBatchToRedis(deviceBatch, TEST_KEY);

		expect(redisClient.json.set).not.toHaveBeenCalled();
	});
});
