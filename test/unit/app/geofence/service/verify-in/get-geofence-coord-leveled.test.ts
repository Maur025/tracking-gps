import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerDebug: vi.fn(),
}));

import { getGeofenceCoordLeveled } from '@app/geofence/service/verify-in/get-geofence-coord-leveled';
import { getArrayDeepLevel } from '@utils/get-array-deep-level';
import { loggerDebug } from '@maur025/core-logger';

describe('get geofence coord leveled test', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should return the same array when deepLevel is equal to levelReturn', () => {
		const arrayParam: number[][] = [
			[1, 2],
			[3, 4],
		];
		const arrayCoords: unknown = getGeofenceCoordLeveled(arrayParam, 2);

		expect(arrayCoords).toBeDefined();
		expect(arrayCoords).toEqual(arrayParam);
		expect(arrayCoords).toBe(arrayParam);
		expect(getArrayDeepLevel(arrayCoords)).toBe(2);
		expect(loggerDebug).not.toHaveBeenCalled();
	});

	test('should return distinc array when deepLevel is different to levelReturn', () => {
		const arrayParam: number[][] = [
			[1, 2],
			[3, 4],
		];
		const arrayCoords: unknown = getGeofenceCoordLeveled(arrayParam, 1);

		expect(arrayCoords).toBeDefined();
		expect(arrayCoords).not.toEqual(arrayParam);
		expect(arrayCoords).not.toBe(arrayParam);
		expect(getArrayDeepLevel(arrayCoords)).toBe(1);
		expect(loggerDebug).not.toHaveBeenCalled();
	});

	test('should return same array and trigger a debug log when deepLevel is less than levelReturn', () => {
		const arrayParam: number[] = [1, 2];

		const arrayCoords: unknown = getGeofenceCoordLeveled(arrayParam, 2);

		expect(arrayCoords).toBeDefined();
		expect(arrayCoords).toEqual(arrayParam);
		expect(arrayCoords).toBe(arrayParam);
		expect(getArrayDeepLevel(arrayCoords)).toBe(1);
		expect(loggerDebug).toHaveBeenCalledWith(
			`[GEOFENCE] (getGeofenceCoords) array coords 1 level is less than 2 required level`,
		);
	});
});
