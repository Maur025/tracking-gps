import { BaseData } from '@maur025/core-model-data';
import z, { number, string } from 'zod/v4';
import { DeventSensorOperator } from './devent-sensor-operator';
import { Sensor } from './sensor';
import { CalcType } from './calc-type';

export const DeventSensor = BaseData.extend({
	deventId: string().nonempty(),
	sensorId: number().nonnegative(),
	calcTypeId: number().nonnegative(),
	operator: DeventSensorOperator,
	value: string(),
	userInput: number(),
	sensor: Sensor.optional(),
	calcType: CalcType.optional(),
});

export type DeventSensor = z.infer<typeof DeventSensor>;
