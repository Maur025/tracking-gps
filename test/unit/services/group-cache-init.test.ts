import { beforeEach, describe, expect, expectTypeOf, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(() => {}),
}));

import { loggerError } from '@maur025/core-logger';
import { GroupResponse } from '@models/dto/response/group-response';
import { groupCacheInit } from '@services/group-cache-init';

describe('Group cache init test', () => {
	const groupResponse = [
		{ name: 'group1', description: 'test description', vehicles: {} },
	] as GroupResponse[];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('should be a function', () => {
		expectTypeOf(groupCacheInit).toBeFunction();
	});

	test('should be receipt once param of group response type', () => {
		groupCacheInit([]);

		expect(loggerError).toHaveBeenCalledWith(
			'group response undefined or empty'
		);
	});

	test('', () => {});
});
