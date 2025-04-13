export default interface ErrorResponse {
	status?: number;
	message?: string;
	error?: boolean;
	cause?: {
		code?: string;
		message?: string;
	};
}
