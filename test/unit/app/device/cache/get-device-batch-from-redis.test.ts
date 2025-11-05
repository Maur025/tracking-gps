import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@common/redis/create-redis-client', () => ({
	redisClient: {
		multi: vi.fn(),
	},
}));

import { redisClient } from '@common/redis/create-redis-client.js';
import { getDeviceBatchFromRedis } from '@app/device/cache/get-device-batch-from-redis.js';
import { Device } from '@app/device/entity/device.js';

describe('get device batch from redis test', () => {
	const mockJsonGet = vi.fn();

	const mockExec = vi.fn();
	const TEST_KEY: string = 'device-key:';

	beforeEach(() => {
		vi.clearAllMocks();

		(redisClient.multi as Mock).mockReturnValue({
			json: { get: mockJsonGet },
			exec: mockExec.mockResolvedValue(
				Array.from({ length: 500 }, (_, i) => ({
					id: `device-id-${i}`,
					type: 'mei-t311',
				})),
			),
		});
	});

	test('should get devices data from redis', async () => {
		const deviceKeyBatch: string[] = Array.from(
			{ length: 500 },
			(_, i) => `${TEST_KEY}${i}`,
		);

		const deviceList: Device[] = await getDeviceBatchFromRedis(deviceKeyBatch);

		expect(redisClient.multi).toHaveBeenCalledOnce();
		expect(mockJsonGet).toHaveBeenCalledTimes(500);

		for (const deviceKey of deviceKeyBatch) {
			expect(mockJsonGet).toHaveBeenCalledWith(deviceKey);
		}

		expect(mockExec).toHaveBeenCalledOnce();

		expect(deviceList).toBeDefined();
		expect(deviceList.length).toBe(500);

		let index = 0;
		for (const device of deviceList) {
			expect(device).toBeDefined();
			expect(device.id).toBeDefined();
			expect(device.id).toBe(`device-id-${index}`);
			expect(device.type).toBeDefined();
			expect(device.type).toBe('mei-t311');

			index++;
		}
	});

	test('should skiping when key batch is empty', async () => {
		const deviceKeyBatch: string[] = [];

		const deviceList: Device[] = await getDeviceBatchFromRedis(deviceKeyBatch);

		expect(redisClient.multi).not.toHaveBeenCalled();
		expect(mockJsonGet).not.toHaveBeenCalled();
		expect(mockExec).not.toHaveBeenCalled();

		expect(deviceList).toBeDefined();
		expect(deviceList.length).toBe(0);
	});
});
