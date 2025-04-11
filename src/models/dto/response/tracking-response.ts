import ApiResponse from '../api-response';

export default interface TrackingResponse
	extends ApiResponse<TrackingResponse> {
	id: string;
}
