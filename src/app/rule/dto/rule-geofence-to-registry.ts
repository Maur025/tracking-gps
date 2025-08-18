import { Device } from '@app/device/entity/device';
import z, { boolean, object } from 'zod/v4';
import { RuleGeofence } from '../entity/rule-geofence';

export const RuleGeofenceToRegistry = object({
	device: Device,
	ruleGeofence: RuleGeofence,
	isIn: boolean(),
});

export type RuleGeofenceToRegistry = z.infer<typeof RuleGeofenceToRegistry>;
