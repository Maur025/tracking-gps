import z from 'zod/v4';
import { object, string } from 'zod/v4';

export const DeviceSetup = object({
	REQ_UPDATE: string().nonempty().optional(),
});

export type DeviceSetup = z.infer<typeof DeviceSetup>;
