import { describe, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import DeviceCache from '../../../src/cache/device-cache';
import Device from '../../../src/models/entity/device';
import { cacheSingleCommonTest } from './cache-single-common-test';

describe('Device Cache Tests', () => {
	const deviceList = [
		{ id: '1', isReady: true },
		{ id: '2', isReady: false },
		{ id: '3', isReady: false },
		{ id: '4', isReady: true },
	] as Device[];

	const cache: DeviceCache = container.resolve(DeviceCache);

	beforeEach(() => {
		cache.clear();
	});

	cacheSingleCommonTest<Device>(cache, deviceList);
});
