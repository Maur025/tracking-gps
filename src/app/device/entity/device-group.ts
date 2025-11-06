import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod';

export const DeviceGroup = BaseData.extend({
	name: string().nonempty(),
	description: string(),
});

export type DeviceGroup = z.infer<typeof DeviceGroup>;
