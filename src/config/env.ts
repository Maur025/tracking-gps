import Environment from '@models/interface/environment.interface';

const { STATIC_PATH, HOST, PORT, BACKEND_URL, TRACK_URL } = process.env;

const environment: Environment = {
	HOST: HOST ?? '172.20.50.60',
	PORT: Number(PORT ?? 7767),
	STATIC_PATH: STATIC_PATH ?? 'public',

	BACKEND_URL: BACKEND_URL ?? 'http://172.20.50.60:9988',
	TRACK_URL: TRACK_URL ?? 'http://172.20.60.7777',
};

export default environment;
