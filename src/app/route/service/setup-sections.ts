import { groupBySection } from './group-by-section';
import { getCoordsByPointSection } from './get-coords-by-point-section';
import { RouteResponse } from '../dto/route-response';
import { Point } from '../entity/Point';

export const setupSections = (route: RouteResponse) => {
	route.tracksIn = [];
	route.tracksOut = [];
	route.splitCoordsLine = [];
	route.extend = [180, 90, -180, -90];

	const pointSectionMap: Map<number, Point[]> = groupBySection(route.points);

	const pointSectionList: [number, Point[]][] = [...pointSectionMap];

	route.sections = pointSectionList.map(
		(pointSection: [number, Point[]], index: number) => {
			return {
				uuid: index.toString(),
				coords: getCoordsByPointSection(pointSection, route),
			};
		},
	);
};
