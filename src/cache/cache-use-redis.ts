export interface CacheUseRedis {
	loadCacheData: () => Promise<void>;
	getRedisKey: () => string;
	getIdxData: () => string;
	getLastUpdate: () => Date | null;
	clearCacheData: () => Promise<void>;
	getKeysAndProcess: (
		process: (
			keyList: AsyncGenerator<string[], void, unknown>
		) => Promise<void>,
		labelProcess?: string
	) => Promise<void>;
}
