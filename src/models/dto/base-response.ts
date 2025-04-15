export default abstract class BaseResponse {
	public message: string;

	constructor(public code: number | null, message: string | null) {
		this.message = this.buildMessage(message);
	}

	private isError(): boolean {
		const hundreds: number = Math.trunc((this.code ?? 0) / 100);

		return hundreds === 4 || hundreds === 5;
	}

	private buildMessage(message: string | null): string {
		if (message) {
			return message;
		}

		if (this.code && !this.isError()) {
			return 'SUCCESS';
		}

		return 'unknown message';
	}
}
