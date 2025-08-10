import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	MockInstance,
	test,
	vi,
} from 'vitest';

vi.mock('@maur025/core-logger', async importOriginal => {
	const logger: object = await importOriginal();

	return {
		...logger,
		loggerError: vi.fn(),
	};
});

import { kakfaProducer } from '@common/kafka/kafka-producer';
import { KafkaPublishSchema } from '@common/kafka/schema/kafka-publish.schema';
import {
	startTestServices,
	stopTestServices,
} from 'test/integration/test-services.setup';
import * as deviceConsumer from '@app/device/consumers/device-tracking-data-consumer';
import { waitForAssert } from 'test/integration/util/wait-for-assert';
import app from '@src/app';
import { loggerError } from '@maur025/core-logger';
import { deviceTrackingDataPayloadFake } from '../payload-fake-data/device-tracking-data-payload-fake';

describe('device tracking data consumer intergration test', () => {
	let publishKafka: <V>(
		kafkaPublishSchema: KafkaPublishSchema<V>,
	) => Promise<void>;

	let deviceTrackingDataConsumerSpy: MockInstance;

	beforeAll(async () => {
		const { start } = app;
		start();

		vi.clearAllMocks();
		deviceTrackingDataConsumerSpy = vi.spyOn(
			deviceConsumer,
			'deviceTrackingDataConsumer',
		);

		await startTestServices({ withKafka: true, withRedis: true });

		const { publish } = kakfaProducer();

		publishKafka = publish;
	});

	afterAll(async () => {
		await stopTestServices();
	});

	beforeEach(() => {
		deviceTrackingDataConsumerSpy.mockClear();
	});

	test('should do early return when payload is invalid', async () => {
		await publishKafka({ topic: 'tracking-gps', value: { saludo: 'hola' } });

		await waitForAssert(() => {
			expect(deviceTrackingDataConsumerSpy).toHaveBeenCalled();
		});

		expect(loggerError).toHaveBeenCalledWith(
			`[DEVICE] (deviceTrackingDataConsumer) validation failed: '\n✖ Invalid input: expected object, received undefined\n  → at spec\n✖ Invalid input: expected object, received undefined\n  → at states'`,
		);
	});

	test('should process device data and return enrich with geofences,rules,alerts, notificarios, vehicle', async () => {
		await publishKafka({
			topic: 'tracking-gps',
			value: deviceTrackingDataPayloadFake,
		});

		await waitForAssert(() => {
			expect(deviceTrackingDataConsumerSpy).toHaveBeenCalled();
		});
	});
});
