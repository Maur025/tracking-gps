import { BaseData } from '@maur025/core-model-data';
import z, { array } from 'zod/v4';
import { TrackResponse } from './track-response.js';

export const WsTrackResponse = BaseData.extend({
	tracks: array(TrackResponse).default([]).optional(),
});

export type WsTrackResponse = z.infer<typeof WsTrackResponse>;
