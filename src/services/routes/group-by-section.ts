import Point from '@models/entity/point';

export const groupBySection = (pointList: Point[]): Map<number, Point[]> => {
	const groupsBySectionMap: Map<number, Point[]> = new Map();

	if (!pointList || !pointList.length) {
		return groupsBySectionMap;
	}

	for (const point of pointList) {
		const { section } = point;

		if (!section) {
			continue;
		}

		const sectionGroupList = groupsBySectionMap.get(section);

		if (!sectionGroupList) {
			groupsBySectionMap.set(section, [point]);
			continue;
		}

		sectionGroupList.push(point);
	}

	return groupsBySectionMap;
};
