import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerWarn: vi.fn(() => {}),
}));

import { loggerWarn } from '@maur025/core-logger';
import { getVehicleMetadata } from '@app/vehicle/service/get-vehicle-metadata';
import { VehicleMetadata } from '@app/vehicle/entity/vehicle-metadata';

describe('get vehicle metadata', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should return data with json string', () => {
		const stringToTest: string = '{"color":"red"}';

		const metadataInJson: VehicleMetadata = getVehicleMetadata(stringToTest);

		expect(loggerWarn).not.toHaveBeenCalled();
		expect(metadataInJson).toBeDefined();
		expect(metadataInJson!.color).toBeDefined();
		expect(metadataInJson!.color).toBe('red');
	});

	test('should return data empty when param is undefined', () => {
		const metadataInJson: VehicleMetadata = getVehicleMetadata(undefined);

		expect(loggerWarn).not.toHaveBeenCalled();
		expect(metadataInJson).toBeDefined();
		expect(metadataInJson!.color).toBeUndefined();
	});

	test('should return empty object when string is mal formed', () => {
		const stringToTest: string = '"color":"red"}';

		const metadataInJson: VehicleMetadata = getVehicleMetadata(stringToTest);

		expect(loggerWarn).toHaveBeenCalledOnce();
		expect(metadataInJson).toBeDefined();
		expect(metadataInJson!.color).toBeUndefined();
	});

	test('should return empty object when JSON parse result is falsy', () => {
		const stringToTest: string = 'null';

		const metadataInJson: VehicleMetadata = getVehicleMetadata(stringToTest);

		expect(loggerWarn).not.toHaveBeenCalled();
		expect(metadataInJson).toBeDefined();
		expect(metadataInJson!.brand).toBeUndefined();
	});
});
