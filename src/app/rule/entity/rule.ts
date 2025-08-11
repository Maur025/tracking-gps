import { Alert } from '@app/alert/entity/alert';
import { BaseData } from '@maur025/core-model-data';
import z, { array, number, string } from 'zod/v4';
import { RuleFrequency } from './rule-frequency';
import { RuleEvent } from './rule-event';
import { RuleGroup } from './rule-group';
import { RuleVehicle } from './rule-vehicle';
import { RuleGeofence } from './rule-geofence';
import { RuleNotification } from './rule-notification';
import { RuleInoutSchema } from './rule-inout-schema';

export const Rule = BaseData.extend({
	name: string().nonempty(),
	description: string().optional(),
	type: string().nullable().optional(),
	inout: RuleInoutSchema.nullable(),
	enabled: number().nonnegative(),
	alerts: array(Alert).default([]),
	frequencies: array(RuleFrequency).default([]),
	events: array(RuleEvent).default([]),
	groups: array(RuleGroup).default([]),
	vehicles: array(RuleVehicle).default([]),
	notifications: array(RuleNotification).default([]),
	geofences: array(RuleGeofence).default([]),
});

export type Rule = z.infer<typeof Rule>;
