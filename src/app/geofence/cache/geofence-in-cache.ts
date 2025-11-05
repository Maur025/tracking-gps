import { singleton } from 'tsyringe';
import { GeofenceIn } from '../entity/geofence-in.js';
import { CacheUseRedis } from '@common/cache/cache-use-redis.js';
import { redisClient } from '@common/redis/create-redis-client.js';
import { loggerError } from '@maur025/core-logger';

@singleton()
export default class GeofenceInCache implements CacheUseRedis {
	private readonly geofenceInMap: Map<string, Map<string, GeofenceIn>> =
		new Map<string, Map<string, GeofenceIn>>();

	public getCache(): Map<string, Map<string, GeofenceIn>> {
		return this.geofenceInMap;
	}

	public getRedisKey(): string {
		return 'geofence-in-gps:';
	}

	public getIdxData(): string {
		return 'idx_geofences_in';
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
			const geofenceInKeyList = await redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(geofenceInKeyList);
		} catch (error: unknown) {
			loggerError(
				`[GEOFENCE] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
