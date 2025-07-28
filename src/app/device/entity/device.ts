import { BaseData } from '@maur025/core-model-data';
import { DeviceConfig } from './device-config';
import z, { number, string } from 'zod/v4';
import { DeviceSetup } from './device-setup';
import { DeviceState } from './device-state';
import { Track } from '@app/track/entity/track';
import { DeviceSpec } from './device-spec';

export const Device = BaseData.extend({
	spec: DeviceSpec,
	config: DeviceConfig.optional(),
	type: string().nonempty().optional(),
	elapsed: number().nonnegative().optional(),
	setup: DeviceSetup.optional(),
	states: DeviceState,
	tracks: number().nonnegative().optional(),
	last: Track.optional(),
});

export type Device = z.infer<typeof Device>;
