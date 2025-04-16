import BaseResponse from './base-response';
import DataResponse from './data-response';

export default interface MultiResponse<T extends DataResponse>
	extends BaseResponse {
	data?: T[];
}
