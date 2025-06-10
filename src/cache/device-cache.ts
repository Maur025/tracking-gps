import Device from '@models/entity/device';
import { singleton } from 'tsyringe';
import AbstractSingleCache from './abstract-single-cache';
import { redisClient } from '@config/redis/create-redis-client';
import { CacheUseRedis } from './cache-use-redis';
import { loggerError } from '@maur025/core-logger';
@singleton()
export default class DeviceCache
	extends AbstractSingleCache<Device>
	implements CacheUseRedis
{
	private readonly deviceMap: Map<string, Device> = new Map<string, Device>();

	private readonly BASE_KEY: string = 'device-gps:';
	private readonly BATH_LIMIT: number = 30;

	private lastUpdate: Date | null = null;

	public getMap(): Map<string, Device> {
		return this.deviceMap;
	}

	protected getResource(): string {
		return 'Device';
	}

	public getRedisKey(): string {
		return this.BASE_KEY;
	}

	public getLastUpdate(): Date | null {
		return this.lastUpdate;
	}

	public async loadCacheData(): Promise<void> {
		const batchKeys: string[] = [];

		this.clear();

		try {
			const deviceKeyList = redisClient.scanIterator({
				MATCH: `${this.BASE_KEY}*`,
			});

			for await (const deviceKey of deviceKeyList) {
				if (deviceKey) {
					console.log('device key', deviceKey);
				}
			}
		} catch (error: unknown) {
			loggerError(`error can't load data in cache: `, error as Error);
		}
	}
}
