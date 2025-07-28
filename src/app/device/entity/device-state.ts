import z, { boolean, number, object, string } from 'zod/v4';

export const DeviceState = object({
	SORTED: boolean().default(false).optional(),
	ACCURACY: string().nonempty().optional(),
	SPEED: string().nonempty().optional(),
	DIRECTION: string().nonempty().optional(),
	IGNITION: string().nonempty().optional(),
	VEHICLE_THEFT: string().nonempty().optional(),
	SIGNAL: string().nonempty().optional(),
	BATTERY_EXTERNAL: string().nonempty().optional(),
	DISARMED: string().nonempty().optional(),
	SLEEP: string().nonempty().optional(),
	FUEL_LEVEL: number().nonnegative().optional(),
	FUEL_TEMP: number().nonnegative().optional(),
});

export type DeviceState = z.infer<typeof DeviceState>;
