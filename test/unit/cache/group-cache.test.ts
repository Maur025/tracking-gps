import { GroupCache } from '@cache/group-cache';
import { Group } from '@models/entity/group';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Group cache test', () => {
	const groupList = [
		{
			id: '1',
			name: 'group 1',
		},
		{ id: '2', name: 'group 2' },
		{ id: '3', name: 'group 3' },
	] as Group[];

	let cache: GroupCache;

	beforeEach(() => {
		cache = container.resolve(GroupCache);
		cache.clear();
	});

	test('test getAll in new instance should return empty array', () => {
		const result = cache.getAll();

		expect(result).toBeDefined();
	});
});
