import { createClient, PingResult } from '@clickhouse/client';
import { loggerError, loggerInfo } from '@maur025/core-logger';
import z, { number, object, string } from 'zod/v4';

let clickhouseClient: ReturnType<typeof createClient>;
const loggerAux: string = `[CLICKHOUSE] (connectToClickhouse)`;

const ConnectToClickhouseSchema = object({
	clickhouseDb: string().nonempty(),
	clickhouseHost: string().nonempty(),
	clickhousePassword: string(),
	clickhousePort: number().nonnegative(),
	clickhouseUser: string().nonempty(),
});

type ConnectToClickhouseSchema = z.infer<typeof ConnectToClickhouseSchema>;

const connectToClickhouse = async (
	request: ConnectToClickhouseSchema,
): Promise<void> => {
	const {
		clickhouseDb,
		clickhouseHost,
		clickhousePassword,
		clickhousePort,
		clickhouseUser,
	} = ConnectToClickhouseSchema.parse(request);

	try {
		clickhouseClient = createClient({
			url: `${clickhouseHost}:${clickhousePort}`,
			request_timeout: 25000,
			username: clickhouseUser,
			password: clickhousePassword,
			application: 'tracking-gps',
			database: clickhouseDb,
		});

		const isAlive: PingResult = await clickhouseClient.ping();

		if (isAlive.success) {
			loggerInfo(
				`${loggerAux} connection successful to ${clickhouseHost}:${clickhousePort}`,
			);
		} else {
			loggerError(`${loggerAux} Ping failed. Server might be unreachable.`);
		}
	} catch (error) {
		loggerError(`${loggerAux} error in connection: ${error}`);
	}
};

export { connectToClickhouse, clickhouseClient };
