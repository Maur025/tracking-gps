import Device from '@models/entity/device';

export const getTrackingCoordinates = ({
	tracks,
}: Device): [number, number][] => {
	const coords: [number, number][] = [];

	for (const { lon, lat } of tracks) {
		coords.push([lon ?? 0, lat ?? 0]);
	}

	return coords;
};
