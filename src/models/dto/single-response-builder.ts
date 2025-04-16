import DataResponse from './data-response';
import SingleResponse from './single-response';
import { Response } from 'express';

export default class SingleResponseBuilder<T extends DataResponse> {
	protected response: SingleResponse<T> | undefined;
	private _res: Response | undefined;

	public static builder<I extends DataResponse>(): SingleResponseBuilder<I> {
		return new SingleResponseBuilder<I>();
	}

	public res(res: Response): this {
		this._res = res;

		return this;
	}

	public withResponse(response: SingleResponse<T>): this {
		this.response = response;

		return this;
	}

	public build(): SingleResponse<T> {
		return { ...(this.response ?? { code: 500 }) };
	}

	public restResponse(): void {
		this._res?.status(this.response?.code ?? 500).json({ ...this.response });
	}
}
