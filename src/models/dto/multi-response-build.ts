import DataResponse from './data-response';
import MultiResponse from './multi-response';

export default class MultiResponseBuild<T extends DataResponse> {
	private _code: number | null = null;
	private _message: string | null = null;
	private _data: T[] | null = null;

	public code(code: number): this {
		this._code = code;

		return this;
	}

	public message(message: string): this {
		this._message = message;

		return this;
	}

	public data(data: T[]): this {
		this._data = data;

		return this;
	}

	public build(): MultiResponse<T> {
		return new MultiResponse<T>(this._code, this._message, this._data);
	}
}
