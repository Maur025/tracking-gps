import z, { number, object, string } from 'zod';

export const RuleRegistryStateCreateRequest = object({
	sensor_id: number(),
	rule_devent_id: string(),
	device_id: string(),
	date: string(),
	value: string(),
});

export type RuleRegistryStateCreateRequest = z.infer<
	typeof RuleRegistryStateCreateRequest
>;
