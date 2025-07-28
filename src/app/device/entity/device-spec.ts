import z, { object, string } from 'zod/v4';

export const DeviceSpec = object({
	name: string().nonempty().optional(),
	brand: string().nonempty().optional(),
	model: string().nonempty().optional(),
	type: string().nonempty().optional(),
});

export type DeviceSpec = z.infer<typeof DeviceSpec>;
