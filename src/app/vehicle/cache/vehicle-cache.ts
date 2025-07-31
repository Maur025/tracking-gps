import AbstractSingleCache from '@common/cache/abstract-single-cache';
import { singleton } from 'tsyringe';
import { Vehicle } from '../entity/vehicle';
import { CacheUseRedis } from '@common/cache/cache-use-redis';
import { redisClient } from '@common/redis/create-redis-client';
import { loggerError } from '@maur025/core-logger';

@singleton()
export default class VehicleCache
	extends AbstractSingleCache<Vehicle>
	implements CacheUseRedis
{
	private readonly vehicleMap: Map<string, Vehicle> = new Map<
		string,
		Vehicle
	>();

	protected getResource(): string {
		return 'Vehicle';
	}

	protected getMap(): Map<string, Vehicle> {
		return this.vehicleMap;
	}

	public getRedisKey(): string {
		return 'vehicle-gps:';
	}

	public getIdxData(): string {
		return 'idx_vehicles';
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
			const vehicleKeyList = await redisClient.scanIterator({
				MATCH: `${this.getRedisKey()}*`,
			});

			await process(vehicleKeyList);
		} catch (error) {
			loggerError(
				`[VEHICLE] (getKeysAndProcess) can't process operation ${labelProcess} cache data in redis cause:`,
				{ cause: error } as Error,
			);
		}
	}
}
