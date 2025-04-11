export default interface Environment {
	HOST: string | undefined;
	PORT: number;
	STATIC_PATH: string;

	BACKEND_URL: string;
	TRACK_URL: string;
}
