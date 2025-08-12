import { Vehicle } from '@app/vehicle/entity/vehicle';
import z, { array, object } from 'zod/v4';
import { DeviceGroup } from '../entity/device-group';
import { loggerDebug } from '@maur025/core-logger';
import { searchByIndexInRedis } from '@common/redis/service/search-by-index-in-redis';
import { container } from 'tsyringe';
import RuleCache from '@app/rule/cache/rule-cache';
import { Rule } from '@app/rule/entity/rule';

const GetDeviceRulesRequest = object({
	vehicleData: Vehicle.optional(),
	groups: array(DeviceGroup).default([]),
});

type GetDeviceRulesRequest = z.infer<typeof GetDeviceRulesRequest>;

export const getDeviceRules = async (
	request: GetDeviceRulesRequest,
): Promise<string[]> => {
	const { vehicleData, groups } = GetDeviceRulesRequest.parse(request);

	if (!vehicleData && !groups.length) {
		loggerDebug(
			`[DEVICE] (getDeviceRules) data of vehicle and groups not founded`,
		);

		return [];
	}

	const ruleCache = container.resolve(RuleCache);
	const ruleList: string[] = [];

	if (vehicleData) {
		const result = await searchByIndexInRedis<Rule>({
			index: ruleCache.getIdxData(),
			query: `@ruleVehicleId:"${vehicleData.id}"`,
		});

		if (!result?.total) {
			loggerDebug(
				`[DEVICE] (getDeviceRules) rules not founded for vehicle ${vehicleData.id}`,
			);
		} else {
			for (const rule of result.documents) {
				if (!rule?.value?.id) {
					continue;
				}

				ruleList.push(rule.value.id);
			}
		}
	}

	return ruleList;
};
