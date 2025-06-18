import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

vi.mock('uuid', () => ({
	v4: vi.fn().mockReturnValue('47e7a06a-dbf5-460b-bae5-ad50c7b253de'),
}));

vi.mock('@maur025/core-model-data', () => ({
	MultiIoResponseBuilder: {
		builder: vi.fn(),
	},
	SingleIoResponseBuilder: {
		builder: vi.fn(),
	},
}));

import { getPayloadSocketResponse } from '@utils/get-payload-socket-response';
import { v4 } from 'uuid';
import {
	MultiIoResponseBuilder,
	SingleIoResponseBuilder,
} from '@maur025/core-model-data';

describe('get payload socket response test', () => {
	const mockMultiBuild: Mock = vi.fn();
	const mockSingleBuild: Mock = vi.fn();

	const mockMultiWithResponse: Mock = vi
		.fn()
		.mockReturnValue({ build: mockMultiBuild });

	const mockSingleWithResponse: Mock = vi
		.fn()
		.mockReturnValue({ build: mockSingleBuild });

	const V4ID: string = '47e7a06a-dbf5-460b-bae5-ad50c7b253de';
	const PAYLOAD_TIMESTAMP = '2025-06-18T19:32:27.457Z';
	const TOPIC_TEST = 'test:event:response';

	beforeEach(() => {
		vi.clearAllMocks();

		(MultiIoResponseBuilder.builder as Mock).mockReturnValue({
			withResponse: mockMultiWithResponse,
		});

		(SingleIoResponseBuilder.builder as Mock).mockReturnValue({
			withResponse: mockSingleWithResponse,
		});
	});

	test('should get payload of array', () => {
		const testList: string[] = ['apple', 'banana', 'orange', 'strawberry'];
		mockMultiBuild.mockReturnValue({
			id: V4ID,
			eventType: TOPIC_TEST,
			timestamp: PAYLOAD_TIMESTAMP,
			data: testList,
		});

		const payload = getPayloadSocketResponse(TOPIC_TEST, testList);

		expect(v4).toHaveBeenCalledOnce();
		expect(MultiIoResponseBuilder.builder).toHaveBeenCalledOnce();
		expect(mockMultiWithResponse).toHaveBeenCalledWith({
			id: V4ID,
			timestamp: expect.any(String),
			eventType: TOPIC_TEST,
			message: undefined,
			data: testList,
		});
		expect(mockMultiBuild).toHaveBeenCalledOnce();

		expect(payload).toBeDefined();
		expect(payload.id).toBe(V4ID);
		expect(payload.eventType).toBe(TOPIC_TEST);
		expect(payload.timestamp).toBe(PAYLOAD_TIMESTAMP);
		expect(payload.data).toBe(testList);
		expect(payload.data).toEqual(testList);
	});

	test('should get payload of object', () => {
		const testObject: object = { name: 'apple', type: 'fruit', color: 'green' };
		mockSingleBuild.mockReturnValue({
			id: V4ID,
			eventType: TOPIC_TEST,
			timestamp: PAYLOAD_TIMESTAMP,
			data: testObject,
		});

		const payload = getPayloadSocketResponse(TOPIC_TEST, testObject);

		expect(v4).toHaveBeenCalledOnce();
		expect(SingleIoResponseBuilder.builder).toHaveBeenCalledOnce();
		expect(mockSingleWithResponse).toHaveBeenCalledWith({
			id: V4ID,
			eventType: TOPIC_TEST,
			timestamp: expect.any(String),
			data: testObject,
		});
		expect(mockSingleBuild).toHaveBeenCalledOnce();

		expect(payload).toBeDefined();
		expect(payload.id).toBe(V4ID);
		expect(payload.eventType).toBe(TOPIC_TEST);
		expect(payload.timestamp).toBe(PAYLOAD_TIMESTAMP);
		expect(payload.data).toBe(testObject);
		expect(payload.data).toEqual(testObject);
	});

	test('should include a message in response', () => {
		const data: string = 'data of test';
		const message: string = 'response test with message';

		mockSingleBuild.mockReturnValue({
			id: V4ID,
			eventType: TOPIC_TEST,
			timestamp: PAYLOAD_TIMESTAMP,
			message,
			data,
		});

		const payload = getPayloadSocketResponse(TOPIC_TEST, data, message);

		expect(v4).toHaveBeenCalledOnce();
		expect(SingleIoResponseBuilder.builder).toHaveBeenCalledOnce();
		expect(mockSingleWithResponse).toHaveBeenCalledWith({
			id: V4ID,
			eventType: TOPIC_TEST,
			timestamp: expect.any(String),
			message,
			data,
		});
		expect(mockSingleBuild).toHaveBeenCalledOnce();

		expect(payload).toBeDefined();
		expect(payload.id).toBe(V4ID);
		expect(payload.eventType).toBe(TOPIC_TEST);
		expect(payload.timestamp).toBe(PAYLOAD_TIMESTAMP);
		expect(payload.message).toBe(message);
		expect(payload.data).toBe(data);
	});
});
