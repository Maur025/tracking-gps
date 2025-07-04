import { BaseData } from '@maur025/core-model-data';
import z, { any, array } from 'zod/v4';
import { TrackResponse } from './track-response';

export const TrackingResponse = BaseData.extend({
	trackb64: array(any()).optional(),
	tracks: array(TrackResponse).optional(),
});

export type TrackingResponse = z.infer<typeof TrackingResponse>;
