import BaseResponse from './base-response';
import DataResponse from './data-response';
import SingleResponseBuild from './single-response-build';

export default class SingleResponse<
	T extends DataResponse
> extends BaseResponse {
	constructor(
		code: number | null,
		message: string | null,
		private data: T | null = null
	) {
		super(code, message);
	}

	public static builder<T extends DataResponse>(): SingleResponseBuild<T> {
		return new SingleResponseBuild<T>();
	}
}
