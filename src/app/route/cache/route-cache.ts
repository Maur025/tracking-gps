import { singleton } from 'tsyringe';
import { Route } from '../entity/route';

@singleton()
export default class RouteCache {
	private routeList: Route[] = [];

	public readonly getAll = (): Route[] => {
		return [...this.routeList];
	};

	public readonly updateAll = (newRouteList: Route[]) => {
		this.routeList = [...newRouteList];
	};

	public readonly clearList = (): void => {
		this.routeList = [];
	};
}
