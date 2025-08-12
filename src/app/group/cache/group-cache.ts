import { singleton } from 'tsyringe';
import { Group } from '../entity/group';
import AbstractSingleCache from '@common/cache/abstract-single-cache';
import { CacheUseRedis } from '@common/cache/cache-use-redis';
import { loggerError } from '@maur025/core-logger';
import { redisClient } from '@common/redis/create-redis-client';

@singleton()
export class GroupCache
	extends AbstractSingleCache<Group>
	implements CacheUseRedis
{
	private readonly groupMap: Map<string, Group> = new Map<string, Group>();

	protected getMap(): Map<string, Group> {
		return this.groupMap;
	}

	protected getResource(): string {
		return 'Group';
	}

	public getRedisKey(): string {
		return 'group-gps:';
	}

	public getIdxData(): string {
		return 'idx_groups';
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
			const groupKeyList = redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(groupKeyList);
		} catch (error) {
			loggerError(
				`[GROUP] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
