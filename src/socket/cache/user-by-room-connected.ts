import AbstractSetCache from '@common/cache/abstract-set-cache';
import { singleton } from 'tsyringe';

@singleton()
export default class UserByRoomConnected extends AbstractSetCache<string> {
	private readonly userByRoomConnectedMap: Map<string, Set<string>> = new Map<
		string,
		Set<string>
	>();

	protected getMap(): Map<string, Set<string>> {
		return this.userByRoomConnectedMap;
	}

	protected getResource(): string {
		return 'UserByRoomConnected';
	}
}
