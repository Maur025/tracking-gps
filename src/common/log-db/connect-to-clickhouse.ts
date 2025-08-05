import { createClient, PingResult } from '@clickhouse/client';
import environment from '@config/env';
import { loggerError, loggerInfo } from '@maur025/core-logger';

const {
	CLICKHOUSE_DB,
	CLICKHOUSE_HOST,
	CLICKHOUSE_PASSWORD,
	CLICKHOUSE_PORT,
	CLICKHOUSE_USER,
} = environment;

let clickhouseClient: ReturnType<typeof createClient>;
const loggerAux: string = `[CLICKHOUSE] (connectToClickhouse)`;

const connectToClickhouse = async (): Promise<void> => {
	try {
		clickhouseClient = createClient({
			url: `${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
			request_timeout: 25000,
			username: CLICKHOUSE_USER,
			password: CLICKHOUSE_PASSWORD,
			application: 'tracking-gps',
			database: CLICKHOUSE_DB,
		});

		const isAlive: PingResult = await clickhouseClient.ping();

		if (isAlive.success) {
			loggerInfo(
				`${loggerAux} connection successful to ${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
			);
		} else {
			loggerError(`${loggerAux} Ping failed. Server might be unreachable.`);
		}
	} catch (error) {
		loggerError(`${loggerAux} error in connection: ${error}`);
	}
};

export { connectToClickhouse, clickhouseClient };
