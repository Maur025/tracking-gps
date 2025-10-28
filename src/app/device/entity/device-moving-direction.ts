import z, { object, enum as enum_, number, boolean } from 'zod/v4';

export const DirectionEnum = enum_([
	'N',
	'S',
	'E',
	'O',
	'NE',
	'NO',
	'SE',
	'SO',
	'UNKNOWN',
]);
export type DirectionEnum = z.infer<typeof DirectionEnum>;

export const DeviceMovingDirection = object({
	direction: DirectionEnum,
	directionInGrades: number().optional(),
	previousDirection: DirectionEnum.optional(),
	previousDirectionInGrades: number().optional(),
	differenceInGrades: number().optional(),
	isStay: boolean().default(true),
});

export type DeviceMovingDirection = z.infer<typeof DeviceMovingDirection>;
