import z, { enum as enum_ } from 'zod/v4';

export const SensorName = enum_([
	'SPEED',
	'FUEL_LEVEL',
	'FUEL_TEMP',
	'IGNITION',
	'EXTERNAL_BATTERY',
	'INTERNAL_BATTERY',
	'GPS_SIGNAL',
	'DIRECTION',
	'DISARMED',
	'SLEEP',
	'PUERTA_1',
	'PUERTA_2',
	'PUERTA_3',
	'PUERTA_4',
	'PUERTA_5',
]);

export type SensorName = z.infer<typeof SensorName>;
