import z, { object, string } from 'zod/v4';

export const ChannelDataParams = object({
	field: string().nonempty(),
	type: string().nonempty(),
	value: string().nonempty(),
});

export type ChannelDataParams = z.infer<typeof ChannelDataParams>;
