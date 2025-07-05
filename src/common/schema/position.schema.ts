import z, { array, number, union } from 'zod/v4';

export const PositionL1 = array(number()).nonempty(); // equal to Position of geojson

export const PositionL2 = array(PositionL1);

export const PositionL3 = array(PositionL2);

export const PositionL4 = array(PositionL3);

export const PositionSchema = union([
	PositionL1,
	PositionL2,
	PositionL3,
	PositionL4,
]);

export type PositionSchema = z.infer<typeof PositionSchema>;

export type PositionL1 = z.infer<typeof PositionL1>;
export type PositionL2 = z.infer<typeof PositionL2>;
export type PositionL3 = z.infer<typeof PositionL3>;
export type PositionL4 = z.infer<typeof PositionL4>;
