import { singleton } from 'tsyringe';
import { Rule } from '../entity/rule.js';
import AbstractSingleCache from '@common/cache/abstract-single-cache.js';
import { CacheUseRedis } from '@common/cache/cache-use-redis.js';
import { redisClient } from '@common/redis/create-redis-client.js';
import { loggerError } from '@maur025/core-logger';

@singleton()
export default class RuleCache
	extends AbstractSingleCache<Rule>
	implements CacheUseRedis
{
	private readonly ruleMap: Map<string, Rule> = new Map<string, Rule>();

	protected getResource(): string {
		return 'Rule';
	}

	protected getMap(): Map<string, Rule> {
		return this.ruleMap;
	}

	public getRedisKey(): string {
		return 'rule-gps:';
	}

	public getIdxData(): string {
		return 'idx_rules';
	}

	public async loadCacheData(): Promise<void> {
		console.log('without implementation');
	}

	public async clearCacheData(): Promise<void> {
		console.log('without implementation');
	}

	public async getKeysAndProcess(
		process: (
			keyList: AsyncGenerator<string[], void, unknown>,
		) => Promise<void>,
		labelProcess: string = 'anything',
	): Promise<void> {
		try {
			const ruleKeyList = redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(ruleKeyList);
		} catch (error) {
			loggerError(
				`[RULE] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
