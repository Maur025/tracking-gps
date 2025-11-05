import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@common/kafka/kafka-consumer', () => ({
	kafkaConsumer: vi.fn(),
}));

import { configureConsumers } from '@config/configure-consumers.js';
import { kafkaConsumer } from '@common/kafka/kafka-consumer.js';
import { kafkaTopics } from '@src/kafka-topics.js';

const { EXAMPLE } = kafkaTopics;

describe('configure consumer test', () => {
	const mockAddConsumer: Mock = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();

		(kafkaConsumer as Mock).mockReturnValue({ addConsumer: mockAddConsumer });
	});

	test('should run consumer add handlers', async () => {
		await configureConsumers();

		expect(mockAddConsumer).toHaveBeenCalledWith(
			expect.objectContaining({
				topics: expect.arrayContaining([EXAMPLE]),
				groupId: 'EXAMPLE-TEST',
				handler: expect.any(Function),
			}),
		);
	});
});
