import { BaseData } from '@maur025/core-model-data';
import { DeviceConfig } from './device-config.js';
import z, { array, number, string } from 'zod/v4';
import { DeviceSetup } from './device-setup.js';
import { DeviceState } from './device-state.js';
import { Track } from '@app/track/entity/track.js';
import { DeviceSpec } from './device-spec.js';
import { Vehicle } from '@app/vehicle/entity/vehicle.js';
import { DeviceGeofenceIn } from './device-geofence-in.js';
import { DeviceGeofenceOut } from './device-geofence-out.js';
import { DeviceGroup } from './device-group.js';
import { DeviceRuleAlertToLaunch } from './device-rule-alert-to-launch.js';
import { DevicePointInterestVisited } from './device-point-interest-visited.js';
import { DeviceMovingDirection } from './device-moving-direction.js';
import { DeviceReconstructedRoad } from './device-reconstructed-road.js';

export const Device = BaseData.extend({
	spec: DeviceSpec,
	config: DeviceConfig.optional(),
	type: string().nonempty().optional(),
	elapsed: number().nonnegative().optional(),
	setup: DeviceSetup.optional(),
	states: DeviceState.optional(),
	tracks: number().nonnegative().optional(),
	last: Track.optional(),
	lastRedisUpdate: number().nonnegative().optional(),
	vehicleData: Vehicle.optional(),
	groups: array(DeviceGroup).default([]),
	geofencesIn: DeviceGeofenceIn.optional(),
	geofencesOut: DeviceGeofenceOut.optional(),
	rulesApplied: array(string()).default([]),
	alertsToLaunch: array(DeviceRuleAlertToLaunch).default([]),
	pointInterestVisited: DevicePointInterestVisited.optional(),
	movingDirection: DeviceMovingDirection.optional(),
	reconstructedRoad: DeviceReconstructedRoad.optional(),
	trackReceivedAt: string().optional(),
	previousTrack: Track.optional(),
});

export type Device = z.infer<typeof Device>;
