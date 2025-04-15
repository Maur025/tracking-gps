import DataResponse from './data-response';

export default interface ApiResponse<T extends DataResponse> {
	code?: number;
	success?: boolean;
	message?: string;
	data?: T | T[];
	content?: T | T[];
}
