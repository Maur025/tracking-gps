import Track from '@models/entity/track';

export const getPercentageCompleted = ({
	routeSelected,
	trackList,
	maxPointDistance,
}: GetPercentageRequest): number => {
	return 0;
};

interface GetPercentageRequest {
	routeSelected?: {
		completed?: number;
	};
	trackList: Track[];
	maxPointDistance: number;
}
