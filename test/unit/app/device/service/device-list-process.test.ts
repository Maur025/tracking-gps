import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({ loggerWarn: vi.fn() }));

vi.mock('@app/device/service/device-sync-enrich-data', () => ({
	deviceSyncEnrichData: vi
		.fn()
		.mockResolvedValue(
			[...Array(25)].map((_, i) => ({ id: `device-id-${i}` })),
		),
}));

vi.mock('@app/device/cache/add-device-cache-data', () => ({
	addDeviceCacheData: vi.fn().mockResolvedValue(undefined),
}));

import { deviceListProcess } from '@app/device/service/device-list-process';
import { container } from 'tsyringe';
import { addDeviceCacheData } from '@app/device/cache/add-device-cache-data';
import { loggerWarn } from '@maur025/core-logger';
import DeviceCache from '@app/device/cache/device-cache';
import { Device } from '@app/device/entity/device';

describe('device list process test', () => {
	let mockDeviceCacheTest: DeviceCache;

	const mockClearCacheData = vi.fn();
	const mockLoadCacheData = vi.fn();

	beforeAll(() => {
		const mockDeviceCache = vi.fn().mockReturnValue({
			clearCacheData: mockClearCacheData,
			loadCacheData: mockLoadCacheData,
		});

		mockDeviceCacheTest = new mockDeviceCache();
	});

	beforeEach(() => {
		vi.clearAllMocks();

		container.clearInstances();

		container.registerInstance(DeviceCache, mockDeviceCacheTest);
	});

	test('should init device data or enrich data in cache local and external', async () => {
		const deviceList = [...Array(25)].map((_, i) => ({
			id: `device-id-${i}`,
		})) as Device[];

		await deviceListProcess({ deviceList });

		expect(mockClearCacheData).toHaveBeenCalledOnce();
		expect(loggerWarn).not.toHaveBeenCalled();

		expect(addDeviceCacheData).toHaveBeenCalledWith(
			[...Array(25)].map((_, i) => ({
				id: `device-id-${i}`,
			})),
		);

		expect(mockLoadCacheData).toHaveBeenCalledOnce();
	});

	test('should skiping init when deviceList is empty', async () => {
		await deviceListProcess({ deviceList: [] });

		expect(mockClearCacheData).toHaveBeenCalledOnce();
		expect(loggerWarn).toHaveBeenCalledWith(
			`device list must not be empty or undefined, skipping initialization ...`,
		);

		expect(mockLoadCacheData).not.toHaveBeenCalled();
	});
});
