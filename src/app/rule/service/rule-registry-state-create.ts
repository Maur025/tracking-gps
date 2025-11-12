import z, { array, object } from 'zod';
import { RuleRegistryStateCreateRequest } from '../dto/request/rule-registry-state-create-request.js';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { container } from 'tsyringe';
import RuleRegistryStateService from './rule-registry-state.service.js';
import { RuleRegistryStateResponse } from '../dto/response/rule-registry-state-response.js';
import { handleAsObject } from '@api-client/service/handle-response.js';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';

const RuleRegistryStateCreateReq = object({
	ruleStateAlertList: array(DeviceRuleAlertToLaunch).default([]),
});

type RuleRegistryStateCreateReq = z.infer<typeof RuleRegistryStateCreateReq>;

const loggerAuxMessage: string = `[RULE] (ruleRegistryStateCreate)`;

export const ruleRegistryStateCreate = async (
	request: RuleRegistryStateCreateReq,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { ruleStateAlertList } = RuleRegistryStateCreateReq.parse(request);

	if (!ruleStateAlertList.length) {
		loggerDebug(`${loggerAuxMessage} no data to registry, skipping...`);
		return [];
	}

	const ruleRegistryStateService = container.resolve(RuleRegistryStateService);

	const responseList = await Promise.all(
		ruleStateAlertList.map(ruleRegistry =>
			ruleRegistryStateService.create<RuleRegistryStateCreateRequest>({
				data: {
					sensor_id: ruleRegistry.sensorId ?? -1,
					rule_devent_id: ruleRegistry.ruleDeventId ?? '',
					device_id: ruleRegistry.deviceId ?? '',
					date: ruleRegistry.timestamp
						? new Date(ruleRegistry.timestamp).toISOString()
						: '',
					value: ruleRegistry.sensorValue ?? '',
				},
			}),
		),
	).catch(error => {
		loggerError(`${loggerAuxMessage} error in fetch all states`, error);
		return undefined;
	});

	if (!responseList) {
		loggerDebug(
			`${loggerAuxMessage} no response from rule registry state create.`,
		);
		return [];
	}

	return ruleStateAlertList
		.map((ruleState, index) => {
			if (responseList[index] === undefined) {
				return undefined;
			}

			const responseData = handleAsObject<RuleRegistryStateResponse>(
				responseList[index],
			);

			return {
				...ruleState,
				ruleRegistryStatesId: responseData?.id,
			};
		})
		.filter(ruleStateAlert => ruleStateAlert !== undefined);
};
