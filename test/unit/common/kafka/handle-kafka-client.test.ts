import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('kafkajs', () => ({ Kafka: vi.fn(), logLevel: { INFO: 4 } }));

import { handleKafkaClient } from '@common/kafka/handle-kafka-client';
import { Kafka } from 'kafkajs';

describe('handle kafka client test', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should return an instance of kafka', () => {
		const { kafkaClient } = handleKafkaClient();

		expect(kafkaClient).toBeDefined();
		expect(kafkaClient).toBeInstanceOf(Kafka);
	});

	test('should return same instance', () => {
		const { kafkaClient: kafkaClientBefore } = handleKafkaClient();

		const { kafkaClient: kafkaClientAfter } = handleKafkaClient();

		expect(kafkaClientAfter).toBe(kafkaClientBefore);
		expect(kafkaClientAfter).toEqual(kafkaClientBefore);
	});

	test('restart should delete kafka instance and replace to new instance of kafka', () => {
		const { kafkaClient: kafkaClienteBefore, restart } = handleKafkaClient();

		restart();

		const { kafkaClient: kafkaClienteAfter } = handleKafkaClient();

		expect(kafkaClienteBefore).not.toBe(kafkaClienteAfter);
		expect(kafkaClienteBefore).toEqual(kafkaClienteAfter);
	});
});
