import { Track } from '@app/track/entity/track.js';

export const getPercentageCompleted = ({
	// routeSelected,
	// trackList,
	maxPointDistance,
}: GetPercentageRequest): number => {
	return maxPointDistance && 0;
};

interface GetPercentageRequest {
	routeSelected?: {
		completed?: number;
	};
	trackList: Track[];
	maxPointDistance: number;
}
