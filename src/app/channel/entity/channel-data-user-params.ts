import z, { object, string } from 'zod/v4';

export const ChannelDataUserParams = object({
	field: string().nonempty(),
	description: string(),
	type: string().nonempty(),
	default: string().default(''),
});

export type ChannelDataUserParams = z.infer<typeof ChannelDataUserParams>;
