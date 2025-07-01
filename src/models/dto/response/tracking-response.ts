import { BaseData } from '@maur025/core-model-data';
import TrackResponse from './track-response';
/**
 * @deprecated interface deprecated ... recomend you to use schema zod
 */
export default interface TrackingResponse extends BaseData {
	trackb64?: [];
	tracks?: TrackResponse[];
}
