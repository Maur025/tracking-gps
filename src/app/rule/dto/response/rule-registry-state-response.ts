import { BaseData } from '@maur025/core-model-data';
import z, { string } from 'zod';

export const RuleRegistryStateResponse = BaseData.extend({
	sensorId: string(),
	ruleDeventId: string(),
	deviceId: string(),
	date: string(),
	value: string(),
});

export type RuleRegistryStateResponse = z.infer<
	typeof RuleRegistryStateResponse
>;
