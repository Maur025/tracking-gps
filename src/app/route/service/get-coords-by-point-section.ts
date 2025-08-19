import { RouteResponse } from '../dto/response/route-response';
import { Point } from '../entity/Point';

export const getCoordsByPointSection = (
	pointSection: [number, Point[]],
	route: RouteResponse,
): [number, number][] => {
	const [minLon, minLat, maxLon, maxLat] = route.extend ?? [0, 0, 0, 0];

	let newMinLon = minLon;
	let newMinLat = minLat;
	let newMaxLon = maxLon;
	let newMaxLat = maxLat;

	const coords: [number, number][] = pointSection[1]?.map((point: Point) => {
		const lat: number = point.lat ?? 0;
		const lon: number = point.lon ?? 0;

		newMinLon = lon < minLon ? lon : minLon;
		newMinLat = lat < minLat ? lat : minLat;
		newMaxLon = lon > maxLon ? lon : maxLon;
		newMaxLat = lat > maxLat ? lat : maxLat;

		return [lon, lat];
	});

	route.extend = [newMinLon, newMinLat, newMaxLon, newMaxLat];

	return coords;
};
