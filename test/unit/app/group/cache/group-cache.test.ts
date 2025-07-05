import { container } from 'tsyringe';
import { beforeEach, describe } from 'vitest';
import { Group } from '@app/group/entity/group';
import { GroupCache } from '@app/group/cache/group-cache';
import { cacheSingleCommonTest } from 'test/unit/common/cache/cache-single-common-test';

describe('Group cache test', () => {
	const groupList = [
		{
			id: '1',
			name: 'group 1',
		},
		{ id: '2', name: 'group 2' },
		{ id: '3', name: 'group 3' },
	] as Group[];

	const cache: GroupCache = container.resolve(GroupCache);

	beforeEach(() => {
		cache.clear();
	});

	cacheSingleCommonTest<Group>(cache, groupList);
});
