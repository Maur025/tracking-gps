import { getArrayDeepLevel } from '@utils/get-array-deep-level.js';
import { describe, expect, test } from 'vitest';

describe('get array deep level test', () => {
	test('should return 2 in an array of arrays', () => {
		const testArray: number[][] = [
			[1, 2],
			[3, 4],
		];

		const deepLevel: number = getArrayDeepLevel(testArray);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(2);
	});

	test('should return 0 in undefined value', () => {
		const deepLevel: number = getArrayDeepLevel(undefined);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(0);
	});

	test('should return 0 in null value', () => {
		const deepLevel: number = getArrayDeepLevel(null);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(0);
	});

	test('should return 0 in string value', () => {
		const deepLevel: number = getArrayDeepLevel('test');

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(0);
	});

	test('should return 1 in array of any', () => {
		const deepLevel: number = getArrayDeepLevel([1, 'test']);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(1);
	});

	test('should return 1 in array empty', () => {
		const deepLevel: number = getArrayDeepLevel([]);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(1);
	});

	test('should return 4 in array of arrays of arrays, with last node empty', () => {
		const deepLevel: number = getArrayDeepLevel([[[[]], [null, null], null]]);

		expect(deepLevel).toBeDefined();
		expect(deepLevel).toBe(4);
	});
});
