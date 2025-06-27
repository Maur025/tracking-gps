import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('@config/kafka/kafka-consumer', () => ({
	kafkaConsumer: vi.fn(),
}));

import { configureConsumers } from '@config/kafka/configure-consumers';
import { kafkaConsumer } from '@config/kafka/kafka-consumer';
import { kafkaTopics } from '@src/kafka-topics';

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
