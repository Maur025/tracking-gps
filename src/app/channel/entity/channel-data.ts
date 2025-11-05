import z, { array, object } from 'zod/v4';
import { ChannelDataParams } from './channel-data-params.js';
import { ChannelDataUserParams } from './channel-data-user-params.js';

export const ChannelData = object({
	params: array(ChannelDataParams).default([]),
	userParams: array(ChannelDataUserParams).default([]),
});

export type ChannelData = z.infer<typeof ChannelData>;
