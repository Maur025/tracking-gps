import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';
import { DeventSensorResponse } from './devent-sensor-response';

export const DeventResponse = BaseData.extend({
	name: string().nonempty(),
	devent_type: string().nonempty(),
	condition: string().nonempty(),
	sensors: array(DeventSensorResponse).default([]),
});

export type DeventResponse = z.infer<typeof DeventResponse>;
