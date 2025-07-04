import { PositionL2 } from '@schemas/position.schema';
import { Device } from '../entity/device';

export const getTrackingCoordinates = ({ tracks }: Device): PositionL2 => {
	const coords: PositionL2 = [];

	for (const { lon, lat } of tracks) {
		coords.push([lon ?? 0, lat ?? 0]);
	}

	return coords;
};
