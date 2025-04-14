import { describe, expect, test } from 'vitest';
import { sum } from '../../../src/utils/sum';

describe('Test Sum', () => {
	test('adds 1 + 2 to equal 3', () => {
		expect(sum(1, 2)).toBe(3);
	});

	test('adds 2 + 2 not to equal 3', () => {
		expect(sum(2, 2)).not.toBe(3);
	});
});
