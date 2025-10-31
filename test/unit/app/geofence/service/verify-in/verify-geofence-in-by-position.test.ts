import { GeofenceType } from '@app/geofence/entity/geofence-type';
import { verifyGeofenceInByPosition } from '@app/geofence/service/verify-in/verify-geofence-in-by-position';
import { describe, expect, test } from 'vitest';

describe('verify geofence in by position test', () => {
	const position = [-68.068619, -16.529871];

	test('should return true when point is inside of radial geofence', () => {
		const geofenceCoords: number[] = [-68.068962, -16.529353];

		const isInside: boolean = verifyGeofenceInByPosition({
			geofenceType: 'POINTS',
			position: position,
			geofenceCoords,
			geofenceRadius: 75,
		});

		expect(isInside).toBeDefined();
		expect(isInside).toBeTruthy();
	});

	test('should return false when point not is inside of radial geofence', () => {
		const geofenceCoords: number[] = [-68.068962, -16.529353];

		const isInside: boolean = verifyGeofenceInByPosition({
			geofenceType: 'POINTS',
			position: position,
			geofenceCoords,
			geofenceRadius: 20,
		});

		expect(isInside).toBeDefined();
		expect(isInside).toBeFalsy();
	});

	test('should throw when geofence type is not supported by zod validation', () => {
		expect(() =>
			verifyGeofenceInByPosition({
				geofenceType: 'NOT_SUPPORTED' as GeofenceType,
				position: position,
				geofenceCoords: [-68.068962, -16.529353],
				geofenceRadius: 20,
			}),
		).toThrow();
	});

	test('should return when position is inside of polygon geofence', () => {
		const geofenceCoords: number[][][] = [
			[
				[-68.068974, -16.529767],
				[-68.068787, -16.530328],
				[-68.067835, -16.529864],
				[-68.068499, -16.52919],
				[-68.068974, -16.529767],
			],
		];

		const isInside: boolean = verifyGeofenceInByPosition({
			geofenceType: 'POLYGONS',
			position: position,
			geofenceCoords,
			geofenceRadius: 0,
		});

		expect(isInside).toBeDefined();
		expect(isInside).toBeTruthy();
	});

	test('should return false when position not is inside of polygon geofence', () => {
		const geofenceCoords: number[][][] = [
			[
				[-68.071169, -16.528148],
				[-68.071545, -16.528385],
				[-68.071269, -16.528692],
				[-68.071169, -16.528148],
			],
		];

		const isInside: boolean = verifyGeofenceInByPosition({
			geofenceType: 'POLYGONS',
			position: position,
			geofenceCoords,
			geofenceRadius: 0,
		});

		expect(isInside).toBeDefined();
		expect(isInside).toBeFalsy();
	});
});
