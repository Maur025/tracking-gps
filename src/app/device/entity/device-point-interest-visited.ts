import { VisitedPointInterest } from '@app/point-interest/dto/visited-point-interest';
import z, { array, number, object } from 'zod/v4';

export const DevicePointInterestVisited = object({
	total: number().nonnegative(),
	passingList: array(VisitedPointInterest),
	passingTotal: number().nonnegative(),
	stayList: array(VisitedPointInterest),
	stayTotal: number().nonnegative(),
});

export type DevicePointInterestVisited = z.infer<
	typeof DevicePointInterestVisited
>;
