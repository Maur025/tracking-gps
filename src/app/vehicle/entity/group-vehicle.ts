import z, { record, string } from 'zod/v4';
import { Group } from '@app/group/entity/group';

export const GroupVehicle = record(string(), Group.optional());

export type GroupVehicle = z.infer<typeof GroupVehicle>;
