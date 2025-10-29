import z, { array, number, object, enum as enum_, string } from 'zod/v4';

export const ReconstructedRoadTypeEnum = enum_(['LineString', 'Point']);
export type ReconstructedRoadTypeEnum = z.infer<
	typeof ReconstructedRoadTypeEnum
>;

export const StatusOfRebuildRoadEnum = enum_([
	'DEVICE_ID_MISSING',
	'ALL_POSITIONS_INVALID',
	'TIME_ELAPSED_INVALID',
	'SAME_POSITION',
	'REBUILD_SUCCESS',
]);

export type StatusOfRebuildRoadEnum = z.infer<typeof StatusOfRebuildRoadEnum>;

export const DeviceReconstructedRoad = object({
	confidence: number(),
	coords: array(array(number())).default([]),
	type: ReconstructedRoadTypeEnum,
	distance: number().optional(),
	duration: number().optional(),
	tracepoints: array(string()).default([]),
	statusOfRebuildRoad: StatusOfRebuildRoadEnum,
});

export type DeviceReconstructedRoad = z.infer<typeof DeviceReconstructedRoad>;
