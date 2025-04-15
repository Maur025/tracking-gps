export class ApiException extends Error {
	public status: number;
	public message: string;
	public error: boolean;

	constructor(status: number, message: string, error: boolean = true) {
		super(message);
		this.status = status;
		this.message = message;
		this.error = error;
	}
}
