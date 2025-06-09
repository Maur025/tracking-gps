export interface CacheUseRedis {
	loadCacheData: () => Promise<void>;
	getRedisKey: () => string;
	getLastUpdate: () => Date | null;
}
