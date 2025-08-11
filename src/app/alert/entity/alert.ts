import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const Alert = BaseData.extend({
	name: string().nonempty(),
	color: string().nonempty().optional(),
	ruleId: string().nonempty(),
	soundId: string().nonempty(),
});

export type Alert = z.infer<typeof Alert>;
