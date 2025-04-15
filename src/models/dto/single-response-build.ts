import DataResponse from './data-response';
import SingleResponse from './single-response';

export default class SingleResponseBuild<T extends DataResponse> {
	private _code: number | null = null;
	private _message: string | null = null;
	private _data: T | null = null;

	public code(code: number): this {
		this._code = code;

		return this;
	}

	public message(message: string): this {
		this._message = message;

		return this;
	}

	public data(data: T): this {
		this._data = data;

		return this;
	}

	public build(): SingleResponse<T> {
		return new SingleResponse<T>(this._code, this._message, this._data);
	}
}
