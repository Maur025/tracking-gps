import { Vehicle } from '@app/vehicle/entity/vehicle';
import z, { array, object } from 'zod/v4';
import { DeviceGroup } from '../entity/device-group';
import { loggerDebug } from '@maur025/core-logger';
import {
	searchByIndexInRedis,
	searchManyByIndexInRedis,
} from '@common/redis/service/search-by-index-in-redis';
import { container } from 'tsyringe';
import RuleCache from '@app/rule/cache/rule-cache';
import { Rule } from '@app/rule/entity/rule';

const GetDeviceRulesRequest = object({
	vehicleData: Vehicle.optional(),
	groups: array(DeviceGroup).default([]),
});

type GetDeviceRulesRequest = z.infer<typeof GetDeviceRulesRequest>;

const loggerAuxPrefix = `[DEVICE] (getDeviceRules)`;

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
	const ruleSet: Set<string> = new Set();

	if (vehicleData) {
		const result = await searchByIndexInRedis<Rule>({
			index: ruleCache.getIdxData(),
			query: `@ruleVehicleId:"${vehicleData.id}"`,
		});

		if (!result?.total) {
			loggerDebug(
				`${loggerAuxPrefix} rules not founded for vehicle ${vehicleData.id}`,
			);
		} else {
			addRulesOfDocuments(ruleSet, result.documents);
		}
	}

	if (groups.length) {
		const groupValueSearchList: string[] = groups.map(({ id = '' }) => id);

		const searchResults = await searchManyByIndexInRedis<Rule>({
			index: ruleCache.getIdxData(),
			indexField: 'ruleGroupId',
			valueList: groupValueSearchList,
		});

		for (const result of searchResults) {
			if (!result?.total) {
				loggerDebug(`${loggerAuxPrefix} rules not founded for group`);
				continue;
			}

			addRulesOfDocuments(ruleSet, result.documents);
		}
	}

	loggerDebug(`${loggerAuxPrefix} quantity of rules founded: ${ruleSet.size}`);

	return [...ruleSet.values()];
};

const addRulesOfDocuments = (
	ruleSet: Set<string>,
	rules: { value: Rule }[],
): void => {
	for (const rule of rules) {
		if (!rule?.value?.id) {
			continue;
		}

		ruleSet.add(rule.value.id);
	}
};
