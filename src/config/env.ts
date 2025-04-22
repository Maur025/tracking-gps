import Environment from '@models/interface/environment.interface';
import path from 'node:path';

const { STATIC_PATH, HOST, PORT, BACKEND_URL, TRACK_URL, LOG_LEVEL, LOG_PATH } =
	process.env;

const environment: Environment = {
	HOST: HOST,
	PORT: Number(PORT ?? 7767),
	STATIC_PATH: STATIC_PATH ?? 'public',

	BACKEND_URL: BACKEND_URL ?? 'http://172.20.50.60:9988',
	TRACK_URL: TRACK_URL ?? 'http://172.20.60.7777',
	LOG_LEVEL: LOG_LEVEL ?? 'info',
	LOG_PATH: path.resolve(process.cwd(), LOG_PATH ?? 'logs'),
};

export default environment;
