import { BaseData } from '@maur025/core-model-data';
import { DeviceConfig } from './device-config';
import z, { array, number, string } from 'zod/v4';
import { DeviceSetup } from './device-setup';
import { DeviceState } from './device-state';
import { Track } from '@app/track/entity/track';
import { DeviceSpec } from './device-spec';
import { Vehicle } from '@app/vehicle/entity/vehicle';
import { DeviceGeofenceIn } from './device-geofence-in';
import { DeviceGeofenceOut } from './device-geofence-out';
import { DeviceGroup } from './device-group';
import { DeviceRuleAlertToLaunch } from './device-rule-alert-to-launch';

export const Device = BaseData.extend({
	spec: DeviceSpec,
	config: DeviceConfig.optional(),
	type: string().nonempty().optional(),
	elapsed: number().nonnegative().optional(),
	setup: DeviceSetup.optional(),
	states: DeviceState,
	tracks: number().nonnegative().optional(),
	last: Track.optional(),
	lastRedisUpdate: number().nonnegative().optional(),
	vehicleData: Vehicle.optional(),
	groups: array(DeviceGroup).default([]),
	geofencesIn: DeviceGeofenceIn.optional(),
	geofencesOut: DeviceGeofenceOut.optional(),
	rulesApplied: array(string()).default([]),
	alertsToLaunch: array(DeviceRuleAlertToLaunch).default([]),
});

export type Device = z.infer<typeof Device>;
