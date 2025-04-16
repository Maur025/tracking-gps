import DataResponse from './data-response';
import MultiResponse from './multi-response';
import { Response } from 'express';

export default class MultiResponseBuilder<T extends DataResponse> {
	protected response: MultiResponse<T> | undefined;
	private _res: Response | undefined;

	public static builder<I extends DataResponse>(): MultiResponseBuilder<I> {
		return new MultiResponseBuilder<I>();
	}

	public res(res: Response): this {
		this._res = res;

		return this;
	}

	public withResponse(response: MultiResponse<T>): this {
		this.response = response;

		return this;
	}

	public build(): MultiResponse<T> {
		return { ...(this.response ?? { code: 500 }) };
	}

	public restResponse(): void {
		this._res?.status(this.response?.code ?? 500).json({ ...this.response });
	}
}
