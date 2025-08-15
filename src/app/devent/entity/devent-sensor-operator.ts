import z, { enum as enum_ } from 'zod/v4';

export const DeventSensorOperator = enum_([
	'>=',
	'<=',
	'<',
	'>',
	'=',
	'!=',
	'<>',
]);

export type DeventSensorOperator = z.infer<typeof DeventSensorOperator>;
