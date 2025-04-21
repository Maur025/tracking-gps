import Stop from '@models/entity/stop';
import Track from '@models/entity/track';

export const getStopsInRoute = (trackList: Track[]): Stop[] => {
	let stopList: Stop[] = [];
	let isStop: boolean = false;

	let stopSwap: Stop = {};

	for (const track of trackList) {
		if (track.stp === 0) {
			isStop = false;
		}

		if (!isStop && track.stp === 1) {
			stopSwap = {
				start_date: track.t,
				start_lat: track.lat,
				start_lon: track.lon,
				end_date: track.t,
				end_lat: track.lat,
				end_lon: track.lon,
			};

			stopList.push(stopSwap);
			isStop = true;
		}

		if (isStop && stopList.length > 0) {
			stopSwap = {
				...stopSwap,
				end_date: track.t,
				end_lat: track.lat,
				end_lon: track.lon,
				duration: 300000 + ((track.t ?? 0) - (stopSwap.start_date ?? 0)),
			};

			stopList[stopList.length - 1] = stopSwap;
		}
	}

	return stopList;
};
