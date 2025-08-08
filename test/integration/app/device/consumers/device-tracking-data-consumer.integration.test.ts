import { kakfaProducer } from '@common/kafka/kafka-producer';
import { KafkaPublishSchema } from '@common/kafka/schema/kafka-publish.schema';
import environment from '@config/env';
import { beforeAll, describe, test } from 'vitest';

const { TEST_KAFKA_BROKER, TEST_KAFKA_CLIENT_ID } = environment;

describe('device tracking data consumer intergration test', () => {
	let publishKafka: <V>(
		kafkaPublishSchema: KafkaPublishSchema<V>,
	) => Promise<void>;

	beforeAll(() => {
		const { publish } = kakfaProducer({
			kafkaBrokers: [TEST_KAFKA_BROKER],
			kafkaClientId: TEST_KAFKA_CLIENT_ID,
			kafkaLogLevel: 'ERROR',
		});

		publishKafka = publish;
	});

	test('test process device data and return enrich with geofences,rules,alerts, notificarios, vehicle', async () => {
		publishKafka({ topic: 'tracking-gps', value: { saludo: 'hola' } });
	});
});
