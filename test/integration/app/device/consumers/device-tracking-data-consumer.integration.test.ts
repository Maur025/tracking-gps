import { kakfaProducer } from '@common/kafka/kafka-producer';
import { KafkaPublishSchema } from '@common/kafka/schema/kafka-publish.schema';
import {
	startTestServices,
	stopTestServices,
} from 'test/integration/test-services.setup';
import { afterAll, beforeAll, describe, test } from 'vitest';

describe('device tracking data consumer intergration test', () => {
	let publishKafka: <V>(
		kafkaPublishSchema: KafkaPublishSchema<V>,
	) => Promise<void>;

	beforeAll(async () => {
		await startTestServices({ withKafka: true });

		const { publish } = kakfaProducer();

		publishKafka = publish;
	});

	afterAll(async () => {
		await stopTestServices();
	});

	test('test process device data and return enrich with geofences,rules,alerts, notificarios, vehicle', async () => {
		await publishKafka({ topic: 'tracking-gps', value: { saludo: 'hola' } });
	});
});
