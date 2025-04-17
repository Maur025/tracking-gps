import BaseResponse from './base-response';
import BaseData from './base-data';

export default interface MultiResponse<T extends BaseData>
	extends BaseResponse {
	data?: T[];
}
