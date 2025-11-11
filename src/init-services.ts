import { cacheInitializer } from '@common/cache/service/cache-initializer.js';
import { connectToClickhouse } from '@common/log-db/connect-to-clickhouse.js';
import { initCLickhouseEntities } from '@common/log-db/init-clickhouse-entities.js';
import { initRedisClient } from '@common/redis/create-redis-client.js';
import { initRecordIdxs } from '@common/redis/init-record-idxs.js';
import { configureConsumers } from '@config/configure-consumers.js';
import { loggerError, loggerWarn } from '@maur025/core-logger';
import { measurePerformance } from '@utils/measure-performance.js';
import z, { number, object, string, array, boolean } from 'zod/v4';

const InitServicesSchema = object({
	redisHost: string().nonempty().optional(),
	redisPort: number().nonnegative().optional(),
	kafkaBrokers: array(string().nonempty()).nonempty().optional(),
	kafkaClientId: string().nonempty().optional(),
	kafkaLogLevel: string().nonempty().optional(),
	clickhouseDb: string().nonempty().optional(),
	clickhouseHost: string().nonempty().optional(),
	clickhousePassword: string().optional(),
	clickhousePort: number().nonnegative().optional(),
	clickhouseUser: string().nonempty().optional(),
	isNeedCache: boolean().default(false).optional(),
});

type InitServicesSchema = z.infer<typeof InitServicesSchema>;

export const initServices = async (request: InitServicesSchema) => {
	const {
		redisHost,
		redisPort,
		kafkaBrokers,
		kafkaClientId,
		kafkaLogLevel,
		clickhouseDb,
		clickhouseHost,
		clickhousePassword,
		clickhousePort,
		clickhouseUser,
		isNeedCache,
	} = InitServicesSchema.parse(request);

	if (redisHost && redisPort) {
		await measurePerformance(
			() => initRedisClient({ redisHost, redisPort }),
			'[REDIS] (initRedisClient) initialized in:',
		);

		await measurePerformance(
			initRecordIdxs,
			`[REDIS] (initRecordIdxs) initialized redis indexes in:`,
		);
	}

	if (
		clickhouseDb &&
		clickhouseHost &&
		clickhousePassword !== undefined &&
		clickhousePort &&
		clickhouseUser
	) {
		await measurePerformance(
			() =>
				connectToClickhouse({
					clickhouseDb,
					clickhouseHost,
					clickhousePassword,
					clickhousePort,
					clickhouseUser,
				}),
			`[CLICKHOUSE] (connectToClickhouse) client initialized in:`,
		);

		await measurePerformance(
			() => initCLickhouseEntities(),
			'[CLICKHOUSE] (initCLickhouseEntities) entities initialized in:',
		);
	}

	if (isNeedCache) {
		await measurePerformance(async () => {
			try {
				await cacheInitializer();
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
	}

	if (kafkaBrokers && kafkaClientId && kafkaLogLevel) {
		await measurePerformance(
			() => configureConsumers({ kafkaBrokers, kafkaClientId, kafkaLogLevel }),
			'[KAFKA] (configureConsumers) consumers ready in:',
		);
	}
};
