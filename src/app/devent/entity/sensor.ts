import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';
import { SensorName } from './sensor-name';

export const Sensor = BaseData.extend({
	name: SensorName,
	description: string().optional(),
});

export type Sensor = z.infer<typeof Sensor>;
