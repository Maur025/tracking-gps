import { singleton } from 'tsyringe';
import { redisClient } from '@common/redis/create-redis-client';
import { loggerError } from '@maur025/core-logger';
import { deleteDeviceCacheData } from '@app/device/cache/delete-device-cache-data';
import { deleteRedisIdx } from '@common/redis/service/delete-redis-idx';
import { getDeviceBatchFromRedis } from '@app/device/cache/get-device-batch-from-redis';
import { Device } from '../entity/device';
import { CacheUseRedis } from '@common/cache/cache-use-redis';
import AbstractSingleCache from '@common/cache/abstract-single-cache';

@singleton()
export default class DeviceCache
	extends AbstractSingleCache<Device>
	implements CacheUseRedis
{
	private readonly deviceMap: Map<string, Device> = new Map<string, Device>();

	private readonly BASE_KEY: string = 'device-gps:';
	private readonly IDX_DATA: string = 'idx_devices';
	private readonly BATCH_LIMIT: number = 500;

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

	public getIdxData(): string {
		return this.IDX_DATA;
	}

	public getLastUpdate(): Date | null {
		return this.lastUpdate;
	}

	public loadCacheData = async (): Promise<void> =>
		this.getKeysAndProcess(async (deviceKeyList): Promise<void> => {
			this.clear();

			let keyBatch: string[] = [];

			for await (const subkeyList of deviceKeyList) {
				if (!subkeyList?.length) {
					continue;
				}

				for (const key of subkeyList) {
					keyBatch.push(key);

					if (keyBatch.length === this.BATCH_LIMIT) {
						const deviceList: Device[] =
							await getDeviceBatchFromRedis(keyBatch);

						this.addMany(deviceList);

						keyBatch = [];
					}
				}
			}

			if (keyBatch.length) {
				const deviceList: Device[] = await getDeviceBatchFromRedis(keyBatch);

				this.addMany(deviceList);
			}
		}, 'load');

	public clearCacheData = async (): Promise<void> =>
		this.getKeysAndProcess(async (deviceKeyList): Promise<void> => {
			let deviceKeyBatch: string[] = [];

			for await (const deviceKeySubList of deviceKeyList) {
				if (!deviceKeySubList.length) {
					continue;
				}

				for (const deviceKey of deviceKeySubList) {
					deviceKeyBatch.push(deviceKey);

					if (deviceKeyBatch.length === this.BATCH_LIMIT) {
						await deleteDeviceCacheData(deviceKeyBatch);
						deviceKeyBatch = [];
					}
				}
			}

			if (deviceKeyBatch.length) {
				await deleteDeviceCacheData(deviceKeyBatch);
				deviceKeyBatch = [];
			}

			await deleteRedisIdx(this.IDX_DATA);
		}, 'delete');

	public getKeysAndProcess = async (
		process: (
			keyList: AsyncGenerator<string[], void, unknown>,
		) => Promise<void>,
		labelProcess: string = 'anything',
	): Promise<void> => {
		try {
			const deviceKeyList = await redisClient.scanIterator({
				MATCH: `${this.BASE_KEY}*`,
			});

			await process(deviceKeyList);
		} catch (error) {
			loggerError(
				`can't process operation ${labelProcess} cache data in redis cause: `,
				error as Error,
			);
		}
	};
}
