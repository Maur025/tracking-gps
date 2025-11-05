import z, { boolean, object, string } from 'zod';

export const DeviceStateDifference = object({
	previousValue: string().optional(),
	currentValue: string().nonempty(),
	stateName: string().nonempty(),
	isDifferent: boolean().default(false),
});

export type DeviceStateDifference = z.infer<typeof DeviceStateDifference>;
