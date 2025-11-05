import { redisClient } from '@common/redis/create-redis-client.js';
import {
	startTestServices,
	stopTestServices,
} from 'test/integration/test-services.setup.js';
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from 'vitest';

const REDIS_TEST_KEY: string = 'redis:test';

describe('create redis client test', () => {
	beforeAll(async () => {
		await startTestServices({ withRedis: true });
	});

	afterAll(async () => {
		await stopTestServices();
	});

	beforeEach(async () => {
		if (redisClient.isOpen) {
			await redisClient.del(REDIS_TEST_KEY);
		}
	});

	test('should be connected to redis', () => {
		expect(redisClient.isOpen).toBeTruthy();
	});

	test('should set data in redis', async () => {
		const valueToUse: string = 'test message';

		await redisClient.set(REDIS_TEST_KEY, valueToUse);

		const dataInRedis: string | null = await redisClient.get(REDIS_TEST_KEY);

		expect(dataInRedis).toBeDefined();
		expect(dataInRedis).not.toBeNull();
		expect(dataInRedis).toBe(valueToUse);
	});

	test('should update data in redis', async () => {
		const valueToUse: string = 'message original';
		const newValueToUpdate: string = 'is a new message to key test';

		await redisClient.set(REDIS_TEST_KEY, valueToUse);
		const originalData: string | null = await redisClient.get(REDIS_TEST_KEY);

		await redisClient.set(REDIS_TEST_KEY, newValueToUpdate);
		const updateData: string | null = await redisClient.get(REDIS_TEST_KEY);

		expect(originalData).toBeDefined();
		expect(originalData).not.toBeNull();
		expect(originalData).toBe(valueToUse);

		expect(updateData).toBeDefined();
		expect(updateData).not.toBeNull();
		expect(updateData).toBe(newValueToUpdate);

		expect(originalData).not.toBe(updateData);
	});

	test('should give an error when key not exist', async () => {
		const dataInRedis: string | null = await redisClient.get('test');

		expect(dataInRedis).toBeDefined();
		expect(dataInRedis).toBeNull();
	});

	test('should delete data in redis', async () => {
		const valueToUse: string = 'is a message to test of redis';

		await redisClient.set(REDIS_TEST_KEY, valueToUse);
		const dataInRedis: string | null = await redisClient.get(REDIS_TEST_KEY);

		await redisClient.del(REDIS_TEST_KEY);

		const dataAfterDeleteInRedis: string | null =
			await redisClient.get(REDIS_TEST_KEY);

		expect(dataInRedis).toBeDefined();
		expect(dataInRedis).not.toBeNull();
		expect(dataInRedis).toBe(valueToUse);

		expect(dataAfterDeleteInRedis).toBeDefined();
		expect(dataAfterDeleteInRedis).toBeNull();
	});
});
