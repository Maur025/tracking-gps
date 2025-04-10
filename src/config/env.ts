import Environment from '@models/interface/environment.interface';

const { SCHEMA, HOST, PORT, BACKEND_URL, TRACK_URL } = process.env;

const environment: Environment = {
	SCHEMA: SCHEMA ?? 'http',
	HOST: HOST ?? '172.20.50.60',
	PORT: Number(PORT ?? 7767),

	BACKEND_URL: BACKEND_URL ?? 'http://172.20.50.60:9988',
	TRACK_URL: TRACK_URL ?? 'http://172.20.60.7777',
};

export default environment;
