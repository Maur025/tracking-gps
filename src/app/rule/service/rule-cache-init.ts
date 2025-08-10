import { loggerError } from '@maur025/core-logger';
import { RuleResponse } from '../dto/rule-response';
import { container } from 'tsyringe';
import RuleCache from '../cache/rule-cache';
import { Rule } from '../entity/rule';
import { addDataInBatch } from '@common/redis/service/add-data-in-batch';
import { addRuleBatchToRedis } from '../cache/add-rule-batch-to-redis';

export const ruleCacheInit = async (
	ruleResponseList: RuleResponse[],
): Promise<void> => {
	if (!ruleResponseList?.length) {
		loggerError('[RULE] (ruleCacheInit) rule response undefined or empty');

		return;
	}

	const ruleCache = container.resolve(RuleCache);

	ruleCache.clear();

	const ruleList: Rule[] = ruleResponseList.map(
		({
			id,
			name,
			description,
			type,
			inout,
			enabled,
			deleted,
			alerts,
			frecuency,
			events,
			groups,
			vehicles,
			notifications,
			geofences,
		}) => ({
			id,
			name,
			description,
			type,
			inout,
			enabled,
			deleted,
			alerts,
			frecuency,
			events,
			groups,
			vehicles,
			notifications,
			geofences,
		}),
	);

	ruleCache.addMany(ruleList);

	await addDataInBatch<Rule>({
		dataList: ruleList,
		dataBaseKey: ruleCache.getRedisKey(),
		registerInRedisFn: addRuleBatchToRedis,
	});
};
