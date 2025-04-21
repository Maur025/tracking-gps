import { BaseResponse } from '@maur025/core-model-data';
import TrackResponse from './track-response';

export default interface WsTrackResponse extends BaseResponse {
	tracks?: TrackResponse[];
}
