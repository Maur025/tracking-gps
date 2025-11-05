import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('uuid', () => ({
	v4: vi.fn(() => `afe39c64-0ec8-4157-b632-8d8924a5dbd6`),
}));

vi.mock('kafkajs', () => ({
	Partitioners: {
		LegacyPartitioner: vi.fn(),
	},
}));

vi.mock('@maur025/core-logger', () => ({
	loggerDebug: vi.fn(),
	loggerError: vi.fn(),
}));

vi.mock('@common/kafka/handle-kafka-client', () => ({
	handleKafkaClient: vi.fn(),
}));

import { handleKafkaClient } from '@common/kafka/handle-kafka-client';
import { kafkaProducer } from '@common/kafka/kafka-producer';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { Partitioners } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

class TestingProducer {
	name: string = '';
}

describe('kafka producer test', () => {
	const mockKafkaClient: Mock = vi.fn();
	const mockConnect: Mock = vi.fn();

	const mockOfLegacyPartitioner: Mock = vi.fn(() => 0);

	const mockSend: Mock = vi.fn(({ messages }) => {
		messages.forEach((msg: unknown) => {
			mockOfLegacyPartitioner({
				topic: 'test1',
				partitionMetadata: [{ partitionId: 0 }],
				message: msg,
			});
		});
	});
	const mockProducer: Mock = vi.fn(() => ({
		connect: mockConnect,
		send: mockSend,
	}));

	beforeEach(() => {
		vi.clearAllMocks();

		(Partitioners.LegacyPartitioner as Mock).mockReturnValue(
			mockOfLegacyPartitioner,
		);

		mockKafkaClient.prototype.producer = mockProducer;

		(handleKafkaClient as Mock).mockReturnValue({
			kafkaClient: new mockKafkaClient(),
		});

		const { restart } = kafkaProducer();
		restart();
	});

	test('should publish payload in kafka with key', async () => {
		const { publish } = kafkaProducer();

		await publish<TestingProducer>({
			topic: 'test1',
			value: { name: 'test name' },
			key: { id: '1234' },
		});

		expect(mockProducer).toHaveBeenCalledWith(
			expect.objectContaining({
				createPartitioner: Partitioners.LegacyPartitioner,
			}),
		);
		expect(mockConnect).toHaveBeenCalledOnce();
		expect(loggerDebug).toHaveBeenCalledWith(
			`[KAFKA] (getProducer) producer is Ready`,
		);
		expect(loggerError).not.toHaveBeenCalled();
		expect(mockSend).toHaveBeenCalledWith(
			expect.objectContaining({
				topic: 'test1',
				messages: expect.arrayContaining([
					expect.objectContaining({
						key: '{"id":"1234"}',
						value: '{"name":"test name"}',
					}),
				]),
			}),
		);
		expect(mockOfLegacyPartitioner).toHaveBeenCalled();
	});

	test('should publish payload in kafka without key', async () => {
		const { publish } = kafkaProducer();

		await publish<TestingProducer>({
			topic: 'test1',
			value: { name: 'test name' },
		});

		expect(mockProducer).toHaveBeenCalledWith(
			expect.objectContaining({
				createPartitioner: Partitioners.LegacyPartitioner,
			}),
		);
		expect(mockConnect).toHaveBeenCalledOnce();
		expect(loggerDebug).toHaveBeenCalledWith(
			`[KAFKA] (getProducer) producer is Ready`,
		);
		expect(loggerError).not.toHaveBeenCalled();
		expect(uuidv4).toHaveBeenCalledOnce();
		expect(mockSend).toHaveBeenCalledWith(
			expect.objectContaining({
				topic: 'test1',
				messages: expect.arrayContaining([
					expect.objectContaining({
						key: '{"id":"afe39c64-0ec8-4157-b632-8d8924a5dbd6"}',
						value: '{"name":"test name"}',
					}),
				]),
			}),
		);
		expect(mockOfLegacyPartitioner).toHaveBeenCalled();
	});

	test('should publish failure when topic is empty', async () => {
		const { publish } = kafkaProducer();

		await publish<TestingProducer>({ topic: '', value: { name: 'test' } });

		expect(mockProducer).toHaveBeenCalledWith(
			expect.objectContaining({
				createPartitioner: Partitioners.LegacyPartitioner,
			}),
		);
		expect(mockConnect).toHaveBeenCalledOnce();
		expect(loggerDebug).toHaveBeenCalledWith(
			`[KAFKA] (getProducer) producer is Ready`,
		);
		expect(loggerError).toHaveBeenCalledWith(
			`[KAFKA] (publish) kafka publish validation failed: '\n✖ Too small: expected string to have >=1 characters\n  → at topic'`,
		);

		expect(mockSend).not.toHaveBeenCalled();
	});

	test('should be reused producer to publish', async () => {
		const { publish: publisOne } = kafkaProducer();

		await publisOne<TestingProducer>({
			topic: 'topic1',
			value: { name: 'test' },
		});

		const { publish: publishTwo } = kafkaProducer();

		await publishTwo<TestingProducer>({
			topic: 'topic-testing',
			value: { name: 'test www' },
			key: { id: '1234' },
		});

		expect(mockProducer).toHaveBeenCalledOnce();
		expect(mockConnect).toHaveBeenCalledOnce();
		expect(loggerDebug).toHaveBeenCalledOnce();

		expect(loggerError).not.toHaveBeenCalled();
		expect(mockSend).toHaveBeenCalledTimes(2);
		expect(mockSend).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				topic: 'topic1',
				messages: expect.arrayContaining([
					expect.objectContaining({
						key: '{"id":"afe39c64-0ec8-4157-b632-8d8924a5dbd6"}',
						value: '{"name":"test"}',
					}),
				]),
			}),
		);
		expect(mockSend).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				topic: 'topic-testing',
				messages: expect.arrayContaining([
					expect.objectContaining({
						key: '{"id":"1234"}',
						value: '{"name":"test www"}',
					}),
				]),
			}),
		);
	});

	test('should redefine when producer be restarted', async () => {
		const { publish: publisOne, restart } = kafkaProducer();

		await publisOne<TestingProducer>({
			topic: 'topic1',
			value: { name: 'test' },
		});

		restart();

		const { publish: publishTwo } = kafkaProducer();

		await publishTwo<TestingProducer>({
			topic: 'topic-testing',
			value: { name: 'test www' },
			key: { id: '1234' },
		});

		expect(mockProducer).toHaveBeenCalledTimes(2);
		expect(mockConnect).toHaveBeenCalledTimes(2);
		expect(loggerDebug).toHaveBeenCalledTimes(2);

		expect(loggerError).not.toHaveBeenCalled();
		expect(mockSend).toHaveBeenCalledTimes(2);
	});
});
