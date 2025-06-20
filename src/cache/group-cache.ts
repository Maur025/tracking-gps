import { singleton } from 'tsyringe';
import AbstractSingleCache from './abstract-single-cache';
import { Group } from '@models/entity/group';

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
