export default interface Environment {
	HOST: string | undefined;
	PORT: number;
	STATIC_PATH: string;

	BACKEND_URL: string;
	TRACK_URL: string;

	REDIS_HOST: string;
	REDIS_PORT: number;

	KAFKA_BROKER: string;
	KAFKA_CLIENT_ID: string;
	KAFKA_LOG_LEVEL: string;
}
