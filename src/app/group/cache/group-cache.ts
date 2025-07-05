import { singleton } from 'tsyringe';
import { Group } from '../entity/group';
import AbstractSingleCache from '@common/cache/abstract-single-cache';

@singleton()
export class GroupCache extends AbstractSingleCache<Group> {
	private readonly groupMap: Map<string, Group> = new Map<string, Group>();

	protected getMap(): Map<string, Group> {
		return this.groupMap;
	}

	protected getResource(): string {
		return 'Group';
	}
}
