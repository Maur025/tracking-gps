import { BaseData } from '@maur025/core-model-data';
import TrackResponse from './track-response';

export default interface TrackingResponse extends BaseData {
	trackb64?: [];
	tracks?: TrackResponse[];
}
