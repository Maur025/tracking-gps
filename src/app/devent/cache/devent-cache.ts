import AbstractSingleCache from '@common/cache/abstract-single-cache.js';
import { Devent } from '../entity/devent.js';
import { CacheUseRedis } from '@common/cache/cache-use-redis.js';
import { singleton } from 'tsyringe';

@singleton()
export default class DeventCache
	extends AbstractSingleCache<Devent>
	implements CacheUseRedis
{
	private readonly deventMap: Map<string, Devent> = new Map<string, Devent>();

	protected getResource(): string {
		return 'Devent';
	}

	protected getMap(): Map<string, Devent> {
		return this.deventMap;
	}

	public getRedisKey(): string {
		return 'devent-gps:';
	}

	public getIdxData(): string {
		return 'idx_devent';
	}

	public async loadCacheData(): Promise<void> {
		console.log('without implementation');
	}

	public async clearCacheData(): Promise<void> {
		console.log('without implementation');
	}

	public async getKeysAndProcess(): Promise<void> {
		console.log('without implementation');
	}
}
