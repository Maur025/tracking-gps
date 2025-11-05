import z, { number, object, string } from 'zod/v4';
import { SensorResponse } from './sensor-response.js';
import { CalcTypeResponse } from './calc-type-response.js';

export const DeventSensorResponse = object({
	id: string(),
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
