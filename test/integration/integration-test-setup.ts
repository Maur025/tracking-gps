import 'dotenv/config';
import 'reflect-metadata';
import '@config/ioc/dependency-injection';
import environment from '@config/env';
import { initServices } from '@src/init-services';

const {
	TEST_REDIS_HOST,
	TEST_REDIS_PORT,
	TEST_KAFKA_BROKER,
	TEST_KAFKA_CLIENT_ID,
	TEST_CLICKHOUSE_DB,
	TEST_CLICKHOUSE_HOST,
	TEST_CLICKHOUSE_PORT,
	TEST_CLICKHOUSE_USER,
	TEST_CLICKHOUSE_PASSWORD,
} = environment;

// beforeAll(async () => {
// 	await initServices({
// 		redisHost: TEST_REDIS_HOST,
// 		redisPort: TEST_REDIS_PORT,
// 		kafkaBrokers: [TEST_KAFKA_BROKER],
// 		kafkaClientId: TEST_KAFKA_CLIENT_ID,
// 		kafkaLogLevel: 'ERROR',
// 		clickhouseDb: TEST_CLICKHOUSE_DB,
// 		clickhouseHost: TEST_CLICKHOUSE_HOST,
// 		clickhousePassword: TEST_CLICKHOUSE_PASSWORD,
// 		clickhousePort: TEST_CLICKHOUSE_PORT,
// 		clickhouseUser: TEST_CLICKHOUSE_USER,
// 	});
// 	console.log('SE INICIALIZARON LOS SERVICIOS');
// });

// afterAll(async () => {
// 	await redisClient.quit();
// 	await clickhouseClient.close();

// 	const { disconnect } = kakfaProducer();
// 	const { disconnectAll } = kafkaConsumer();
// 	const { restart } = handleKafkaClient();

// 	await disconnect();
// 	await disconnectAll();
// 	restart();
// });;

const globalSetup = async () => {
	console.log('Iniciando servicios globalmente...');
	await initServices({
		redisHost: TEST_REDIS_HOST,
		redisPort: TEST_REDIS_PORT,
		kafkaBrokers: [TEST_KAFKA_BROKER],
		kafkaClientId: TEST_KAFKA_CLIENT_ID,
		kafkaLogLevel: 'ERROR',
		clickhouseDb: TEST_CLICKHOUSE_DB,
		clickhouseHost: TEST_CLICKHOUSE_HOST,
		clickhousePassword: TEST_CLICKHOUSE_PASSWORD,
		clickhousePort: TEST_CLICKHOUSE_PORT,
		clickhouseUser: TEST_CLICKHOUSE_USER,
	});
	// // Guarda los clientes en una variable global para acceso posterior
	// globalThis.__redisClient = redisClient;
	// globalThis.__clickhouseClient = clickhouseClient;
	// console.log('✅ Servicios inicializados.');

	// return async () => {
	// 	console.log('Cerrando servicios globalmente...');
	// 	if (globalThis.__redisClient) {
	// 		await globalThis.__redisClient.quit();
	// 	}
	// 	if (globalThis.__clickhouseClient) {
	// 		await globalThis.__clickhouseClient.close();
	// 	}
	// 	const { disconnect } = kakfaProducer();
	// 	const { disconnectAll } = kafkaConsumer();
	// 	const { restart } = handleKafkaClient();
	// 	await disconnect();
	// 	await disconnectAll();
	// 	restart();
	// 	console.log('✅ Servicios cerrados.');
	// };
};

export default globalSetup;
