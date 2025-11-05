import { BaseData } from '@maur025/core-model-data';
import z, { array, string } from 'zod/v4';
import { DeventType } from './devent-type.js';
import { DeventCondition } from './devent-condition.js';
import { DeventSensor } from './devent-sensor.js';

export const Devent = BaseData.extend({
	name: string().nonempty(),
	deventType: DeventType,
	condition: DeventCondition,
	sensors: array(DeventSensor).default([]),
});

export type Devent = z.infer<typeof Devent>;
