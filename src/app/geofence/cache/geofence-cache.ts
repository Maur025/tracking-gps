import { singleton } from 'tsyringe';
import { Geofence } from '@app/geofence/entity/geofence.js';
import AbstractSingleCache from '@common/cache/abstract-single-cache.js';
import { CacheUseRedis } from '@common/cache/cache-use-redis.js';
import { redisClient } from '@common/redis/create-redis-client.js';
import { loggerError } from '@maur025/core-logger';

@singleton()
export default class GeofenceCache
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
		return 'geofence-gps:';
	}

	public getIdxData(): string {
		return 'idx_geofences';
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
			const geofenceKeyList = await redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(geofenceKeyList);
		} catch (error: unknown) {
			loggerError(
				`[GEOFENCE] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
