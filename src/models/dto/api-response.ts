import BaseData from './base-data';
export default interface ApiResponse<T extends BaseData> {
	code?: number;
	success?: boolean;
	message?: string;
	data?: T | T[];
	content?: T | T[];
}
