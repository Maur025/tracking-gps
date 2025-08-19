import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';
import { SensorResponse } from './sensor-response';
import { CalcTypeResponse } from './calc-type-response';

export const DeventSensorResponse = BaseData.extend({
	devent_id: string().nonempty(),
	sensor_id: number().nonnegative(),
	calctype_id: number().nonnegative(),
	operator: string(),
	value: string(),
	userinput: number(),
	sensor: SensorResponse.optional(),
	calctype: CalcTypeResponse.optional(),
});

export type DeventSensorResponse = z.infer<typeof DeventSensorResponse>;
