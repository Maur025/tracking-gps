import BaseResponse from './base-response';
import DataResponse from './data-response';
import MultiResponseBuild from './multi-response-build';

export default class MultiResponse<
	T extends DataResponse
> extends BaseResponse {
	constructor(
		code: number | null,
		message: string | null,
		private data: T[] | null = null
	) {
		super(code, message);
	}

	public static builder<T extends DataResponse>(): MultiResponseBuild<T> {
		return new MultiResponseBuild<T>();
	}
}
