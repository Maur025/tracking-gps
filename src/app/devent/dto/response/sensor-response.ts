import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const SensorResponse = BaseData.extend({
	name: string(),
	description: string().optional(),
});

export type SensorResponse = z.infer<typeof SensorResponse>;
