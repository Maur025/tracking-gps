import { AlertResponse } from '@app/alert/dto/alert-response';
import { BaseData } from '@maur025/core-model-data';
import z, { array, number, string } from 'zod/v4';
import { RuleEventResponse } from './rule-event-response';
import { RuleFrequencyResponse } from './rule-frequency-response';
import { RuleGroupResponse } from './rule-group-response';
import { RuleVehicleResponse } from './rule-vehicle-response';
import { RuleGeofenceResponse } from './rule-geofence-response';
import { RuleNotificationResponse } from './rule-notification-response';

export const RuleResponse = BaseData.extend({
	name: string(),
	description: string().optional(),
	type: string().nullable().optional(),
	inout: string().nonempty(),
	enabled: number().nonnegative(),
	alerts: array(AlertResponse).default([]),
	frequency: array(RuleFrequencyResponse).default([]),
	events: array(RuleEventResponse).default([]),
	groups: array(RuleGroupResponse).default([]),
	vehicles: array(RuleVehicleResponse).default([]),
	notifications: array(RuleNotificationResponse).default([]),
	geofences: array(RuleGeofenceResponse).default([]),
});

export type RuleResponse = z.infer<typeof RuleResponse>;
