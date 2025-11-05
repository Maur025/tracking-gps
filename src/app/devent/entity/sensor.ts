import z, { number, object, string } from 'zod/v4';
import { SensorName } from './sensor-name.js';

export const Sensor = object({
	id: number(),
	name: SensorName,
	description: string().optional(),
});

export type Sensor = z.infer<typeof Sensor>;
