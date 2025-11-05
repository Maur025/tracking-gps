import z, { record, string } from 'zod/v4';
import { Group } from '@app/group/entity/group.js';

export const GroupVehicle = record(string(), Group.optional());

export type GroupVehicle = z.infer<typeof GroupVehicle>;
