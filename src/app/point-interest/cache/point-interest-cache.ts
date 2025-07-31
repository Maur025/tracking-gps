import { Geofence } from '@app/geofence/entity/geofence';
import AbstractSingleCache from '@common/cache/abstract-single-cache';
import { CacheUseRedis } from '@common/cache/cache-use-redis';
import { redisClient } from '@common/redis/create-redis-client';
import { loggerError } from '@maur025/core-logger';
import { singleton } from 'tsyringe';

@singleton()
export default class PointInterestCache
	extends AbstractSingleCache<Geofence>
	implements CacheUseRedis
{
	private readonly geofenceMap: Map<string, Geofence> = new Map<
		string,
		Geofence
	>();

	protected getMap(): Map<string, Geofence> {
		return this.geofenceMap;
	}

	protected getResource(): string {
		return 'Geofence';
	}

	public getRedisKey(): string {
		return 'point-interest-gps:';
	}

	public getIdxData(): string {
		return 'idx_points_interest';
	}

	public async loadCacheData(): Promise<void> {}
	public async clearCacheData(): Promise<void> {}

	public async getKeysAndProcess(
		process: (
			keyList: AsyncGenerator<string[], void, unknown>,
		) => Promise<void>,
		labelProcess: string = 'anything',
	): Promise<void> {
		try {
			const pointInterestKeyList = await redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(pointInterestKeyList);
		} catch (error) {
			loggerError(
				`[POINT-INTEREST] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
