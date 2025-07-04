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
import { Socket } from 'socket.io-client';
import { container } from 'tsyringe';
import { addDeviceCacheData } from '@app/device/cache/add-device-cache-data';
import { loggerWarn } from '@maur025/core-logger';
import { externalSocketTopics } from '@src/external-socket-topics';
import DeviceCache from '@app/device/cache/device-cache';
import { deviceSyncEnrichData } from '@app/device/service/device-sync-enrich-data';
import { Device } from '@app/device/entity/device';

const { DEVICE_UNSUBSCRIBE_ALL, DEVICE_SUBSCRIBE } = externalSocketTopics;

describe('device list process test', () => {
	let mockSocketTest: Socket;
	let mockDeviceCacheTest: DeviceCache;

	const mockClearCacheData = vi.fn();
	const mockLoadCacheData = vi.fn();
	const mockSocketEmit = vi.fn();

	beforeAll(() => {
		const mockSocket = vi.fn().mockReturnValue({
			emit: mockSocketEmit,
			on: vi.fn(),
		});

		const mockDeviceCache = vi.fn().mockReturnValue({
			clearCacheData: mockClearCacheData,
			loadCacheData: mockLoadCacheData,
		});

		mockSocketTest = new mockSocket();
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

		await deviceListProcess({ deviceList, socketClient: mockSocketTest });

		expect(mockClearCacheData).toHaveBeenCalledOnce();
		expect(loggerWarn).not.toHaveBeenCalled();

		expect(mockSocketEmit).toHaveBeenCalledTimes(2);
		expect(mockSocketEmit).toHaveBeenNthCalledWith(
			1,
			DEVICE_UNSUBSCRIBE_ALL,
			'',
		);
		expect(mockSocketEmit).toHaveBeenNthCalledWith(
			2,
			DEVICE_SUBSCRIBE,
			[...Array(25)].map((_, i) => `device-id-${i}`),
		);

		expect(deviceSyncEnrichData).toHaveBeenCalledWith(deviceList);

		expect(addDeviceCacheData).toHaveBeenCalledWith(
			[...Array(25)].map((_, i) => ({
				id: `device-id-${i}`,
				personal: expect.any(Object),
			})),
		);

		expect(mockLoadCacheData).toHaveBeenCalledOnce();
	});

	test('should skiping init when deviceList is empty', async () => {
		await deviceListProcess({ deviceList: [], socketClient: mockSocketTest });

		expect(mockClearCacheData).toHaveBeenCalledOnce();
		expect(loggerWarn).toHaveBeenCalledWith(
			`device list must not be empty or undefined, skipping initialization ...`,
		);

		expect(mockSocketEmit).not.toHaveBeenCalled();
		expect(deviceSyncEnrichData).not.toHaveBeenCalled();
		expect(mockLoadCacheData).not.toHaveBeenCalled();
	});
});
