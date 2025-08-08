import { cacheInitializer } from '@common/cache/service/cache-initializer';
import { connectToClickhouse } from '@common/log-db/connect-to-clickhouse';
import { initCLickhouseEntities } from '@common/log-db/init-clickhouse-entities';
import { initRedisClient } from '@common/redis/create-redis-client';
import { configureConsumers } from '@config/configure-consumers';
import { loggerError, loggerWarn } from '@maur025/core-logger';
import { measurePerformance } from '@utils/measure-performance';
import { defaultIfEmpty, lastValueFrom } from 'rxjs';
import z, { number, object, string, array } from 'zod/v4';

const InitServicesSchema = object({
	redisHost: string().nonempty(),
	redisPort: number().nonnegative(),
	kafkaBrokers: array(string().nonempty()).nonempty(),
	kafkaClientId: string().nonempty(),
	kafkaLogLevel: string().nonempty(),
});

type InitServicesSchema = z.infer<typeof InitServicesSchema>;

export const initServices = async (request: InitServicesSchema) => {
	const { redisHost, redisPort, kafkaBrokers, kafkaClientId, kafkaLogLevel } =
		InitServicesSchema.parse(request);

	await measurePerformance(
		() => initRedisClient({ redisHost, redisPort }),
		'[REDIS] (initRedisClient) initialized in:',
	);

	await measurePerformance(
		() => connectToClickhouse(),
		`[CLICKHOUSE] (connectToClickhouse) client initialized in:`,
	);

	await measurePerformance(
		() => initCLickhouseEntities(),
		'[CLICKHOUSE] (initCLickhouseEntities) entities initialized in:',
	);

	await measurePerformance(async () => {
		try {
			await lastValueFrom(cacheInitializer().pipe(defaultIfEmpty(null)));
		} catch (error: unknown) {
			loggerError(
				`[SYSTEM] (cacheInitializer) error occurred while initializing cache -> `,
				error as Error,
			);
			loggerWarn(
				`[SYSTEM] (cacheInitializer) client sockets will not be initialized.`,
			);
		}
	}, '[SYSTEM] (cacheInitializer) cache initialized in:');

	await measurePerformance(
		() => configureConsumers({ kafkaBrokers, kafkaClientId, kafkaLogLevel }),
		'[KAFKA] (configureConsumers) consumers ready in:',
	);
};
