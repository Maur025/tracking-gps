import {
	beforeAll,
	beforeEach,
	describe,
	expect,
	Mock,
	test,
	vi,
} from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(),
	loggerInfo: vi.fn(),
}));

vi.mock('@common/kafka/handle-kafka-client', () => ({
	handleKafkaClient: vi.fn(),
}));

import { handleKafkaClient } from '@common/kafka/handle-kafka-client';
import { kafkaConsumer } from '@common/kafka/kafka-consumer';
import { KafkaRecordSchema } from '@common/kafka/schema/kafka-record.schema';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import { EachMessagePayload, Kafka } from 'kafkajs';

class TestingConsumer {
	name: string = '';
}

describe('kafka consumer test', () => {
	let mockKafkaClient: Kafka;
	const mockConnect: Mock = vi.fn(() => ({}));
	const mockSubscribe: Mock = vi.fn(() => ({}));

	let captureEachMessage: (payload: EachMessagePayload) => Promise<void>;

	const mockRun: Mock = vi.fn(({ eachMessage }) => {
		captureEachMessage = eachMessage;
	});
	const mockPause: Mock = vi.fn();
	const mockResume: Mock = vi.fn();
	const mockConsumer: Mock = vi.fn(() => ({
		connect: mockConnect,
		subscribe: mockSubscribe,
		run: mockRun,
		pause: mockPause,
		resume: mockResume,
	}));

	const groupId: string = 'test.vitest.group';

	beforeAll(() => {
		const MockKafkaClient: Mock = vi.fn();
		MockKafkaClient.prototype.consumer = mockConsumer;

		mockKafkaClient = new MockKafkaClient();
	});

	beforeEach(() => {
		vi.resetAllMocks();

		(handleKafkaClient as Mock).mockReturnValue({
			kafkaClient: mockKafkaClient,
		});
	});

	test('addConsumer should add a new consumer with topics and group id', async () => {
		const { addConsumer } = kafkaConsumer();

		await addConsumer<TestingConsumer>({
			topics: ['test1', 'test2'],
			groupId,
			handler: async (record: KafkaRecordSchema<TestingConsumer>) => {
				expect(record.value).toBeDefined();
				expect(record.value).toEqual({ name: 'test name' });
			},
		});

		expect(loggerError).not.toHaveBeenCalled();
		expect(mockConsumer).toHaveBeenCalledWith(
			expect.objectContaining({ groupId }),
		);
		expect(mockConnect).toHaveBeenCalledOnce();
		expect(mockSubscribe).toHaveBeenCalledTimes(2);
		expect(mockSubscribe).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ topic: 'test1' }),
		);
		expect(mockSubscribe).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ topic: 'test2' }),
		);

		expect(mockRun).toHaveBeenCalledWith(
			expect.objectContaining({
				eachMessage: expect.any(Function),
			}),
		);

		expect(loggerInfo).toHaveBeenCalledWith(
			`[KAFKA] (addConsumer) joined to [${groupId}]`,
		);

		await captureEachMessage({
			topic: 'test1',
			partition: 0,
			message: {
				timestamp: '123456',
				key: Buffer.from('{"id":"1"}'),
				attributes: 1,
				headers: {},
				offset: '1',
				value: Buffer.from('{"name":"test name"}'),
			},
			pause: () => () => {},
			heartbeat: async () => {},
		});

		expect(mockPause).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					topic: 'test1',
					partitions: [0],
				}),
			]),
		);

		expect(mockResume).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					topic: 'test1',
					partitions: [0],
				}),
			]),
		);
	});

	test('addConsumer should failure when topics is empty', async () => {
		const { addConsumer } = kafkaConsumer();

		await addConsumer({ topics: [], groupId, handler: async () => {} });

		expect(loggerError).toHaveBeenCalledOnce();
		expect(loggerError).toHaveBeenCalledWith(
			`[KAFKA] (addConsumer) validation failed: '\n✖ Too small: expected array to have >=1 items\n  → at topics'`,
		);

		expect(mockConsumer).not.toHaveBeenCalled();
		expect(mockConnect).not.toHaveBeenCalled();
		expect(mockSubscribe).not.toHaveBeenCalled();
		expect(mockRun).not.toHaveBeenCalled();
		expect(mockPause).not.toHaveBeenCalled();
		expect(mockResume).not.toHaveBeenCalled();
	});

	test('addConsumer should failure when groupId is empty', async () => {
		const { addConsumer } = kafkaConsumer();

		await addConsumer({
			topics: ['topicTest'],
			groupId: '',
			handler: async () => {},
		});

		expect(loggerError).toHaveBeenCalledOnce();
		expect(loggerError).toHaveBeenCalledWith(
			`[KAFKA] (addConsumer) validation failed: '\n✖ Too small: expected string to have >=1 characters\n  → at groupId'`,
		);

		expect(mockConsumer).not.toHaveBeenCalled();
		expect(mockConnect).not.toHaveBeenCalled();
		expect(mockSubscribe).not.toHaveBeenCalled();
		expect(mockRun).not.toHaveBeenCalled();
		expect(mockPause).not.toHaveBeenCalled();
		expect(mockResume).not.toHaveBeenCalled();
	});
});
