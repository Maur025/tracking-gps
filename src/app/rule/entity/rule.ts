import { Alert } from '@app/alert/entity/alert';
import { BaseData } from '@maur025/core-model-data';
import z, { any, array, number, string } from 'zod/v4';
import { RuleFrequency } from './rule-frequency';
import { RuleEvent } from './rule-event';
import { RuleGroup } from './rule-group';
import { RuleVehicle } from './rule-vehicle';
import { RuleGeofence } from './rule-geofence';

export const Rule = BaseData.extend({
	name: string().nonempty(),
	description: string().optional(),
	type: string().nullable().optional(),
	inout: string().nonempty(),
	enabled: number().nonnegative(),
	deleted: number(),
	alerts: array(Alert).default([]),
	frecuency: array(RuleFrequency).default([]),
	events: array(RuleEvent).default([]),
	groups: array(RuleGroup).default([]),
	vehicles: array(RuleVehicle).default([]),
	notifications: array(any()).default([]),
	geofences: array(RuleGeofence).default([]),
});

export type Rule = z.infer<typeof Rule>;
