import AbstractSingleCache from '@common/cache/abstract-single-cache.js';
import { singleton } from 'tsyringe';
import { Channel } from '../entity/channel.js';
import { CacheUseRedis } from '@common/cache/cache-use-redis.js';

@singleton()
export default class ChannelCache
	extends AbstractSingleCache<Channel>
	implements CacheUseRedis
{
	private readonly channelMap: Map<string, Channel> = new Map<
		string,
		Channel
	>();

	protected getResource(): string {
		return 'Channel';
	}

	protected getMap(): Map<string, Channel> {
		return this.channelMap;
	}

	public getRedisKey(): string {
		return 'channel-gps:';
	}

	public getIdxData(): string {
		return 'idx_channels';
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
