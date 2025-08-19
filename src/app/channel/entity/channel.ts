import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod/v4';

export const Channel = BaseData.extend({
	name: string().nonempty(),
	data: string().nonempty(),
	cprotocolId: string().nonempty(),
});

export type Channel = z.infer<typeof Channel>;
