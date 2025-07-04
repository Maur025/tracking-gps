import { BaseData } from '@maur025/core-model-data';
import { DeviceConfig } from './device-config';
import z, { array, boolean, number, object, string } from 'zod/v4';
import { DeviceSetup } from './device-setup';
import { DeviceState } from './device-state';
import { Track } from '@app/track/entity/track';
import { PositionL2 } from '@schemas/position.schema';
import { TrackStop } from '@app/track/entity/track-stop';
import { Route } from '@app/route/entity/route';

export const Device = BaseData.extend({
	config: DeviceConfig.optional(),
	type: string().nonempty().optional(),
	elapsed: number().nonnegative().optional(),
	setup: DeviceSetup.optional(),
	states: DeviceState,
	tracks: array(Track).default([]),
	last: Track.optional(),
	isReady: boolean().default(false).optional(),
	tracksCoord: PositionL2,
	stops: array(TrackStop).default([]).optional(),
	routeSelected: Route.optional(),
	// remove when vehicle problems be resolved
	personal: object({
		plaque: string().nonempty().optional(),
		name: string().nonempty().optional(),
		icon: string().nonempty().optional(),
	}).optional(),
});

export type Device = z.infer<typeof Device>;
