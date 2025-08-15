import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { Rule } from '../entity/rule';

const ProcessRuleRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessRuleRequest = z.infer<typeof ProcessRuleRequest>;

export const processRule = async (
	request: ProcessRuleRequest,
): Promise<void> => {
	const { device, rule } = ProcessRuleRequest.parse(request);

	console.log(device);
	console.log(rule);
};
