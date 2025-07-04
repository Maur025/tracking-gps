import { singleton } from 'tsyringe';
import AbstractSingleCache from '@cache/abstract-single-cache';
import { Group } from '../entity/group';

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
