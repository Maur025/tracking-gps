import { BaseData } from '@maur025/core-model-data';
import z from 'zod/v4';
import { string } from 'zod/v4';

export const DeviceGroup = BaseData.extend({
	name: string().nonempty(),
	description: string(),
});

export type DeviceGroup = z.infer<typeof DeviceGroup>;
