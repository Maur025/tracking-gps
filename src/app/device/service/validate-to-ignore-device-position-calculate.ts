import z, { any, object, string } from 'zod/v4';
import { Device } from '../entity/device';
import { Track } from '@app/track/entity/track';
import { loggerDebug } from '@maur025/core-logger';
import { getTotalSecondsElapsedSincePreviousTimestamp } from './get-total-elapsed-since-previous-timestamp';

const ValidateToIgnoreDevicePositionCalculateReq = object({
	device: Device,
	previousDeviceTrack: Track.optional(),
	loggerAuxData: string().default(
		`[DEVICE] (validateToIgnoreDevicePositionCalculate)`,
	),
	noIdCallback: any().nonoptional(),
	otherValidationsCallback: any().nonoptional(),
});

type ValidateToIgnoreDevicePositionCalculateReq<R> = Omit<
	z.infer<typeof ValidateToIgnoreDevicePositionCalculateReq>,
	'noIdCallback' | 'otherValidationsCallback'
> & {
	noIdCallback: () => R;
	otherValidationsCallback: () => R;
};

export const validateToIgnoreDevicePositionCalculate = <T>(
	request: ValidateToIgnoreDevicePositionCalculateReq<T>,
): T | undefined => {
	const { device, previousDeviceTrack, loggerAuxData } =
		ValidateToIgnoreDevicePositionCalculateReq.parse(request);

	const { noIdCallback, otherValidationsCallback } = request;

	if (!device?.id) {
		loggerDebug(
			`${loggerAuxData} device id invalid, nothing to calculate, skipping...`,
		);

		return noIdCallback();
	}

	const { lat = 0, lon = 0, t: timestamp = 0 } = device?.last ?? {};
	const {
		lat: previousLat = 0,
		lon: previousLon = 0,
		t: previousTimestamp = 0,
	} = previousDeviceTrack ?? {};

	if (!previousLat && !previousLon && !lat && !lon) {
		loggerDebug(
			`${loggerAuxData} device position prev and current are invalid, loading lastest data...`,
		);

		return otherValidationsCallback();
	}

	const timeElapsedSincePreviousTrack =
		getTotalSecondsElapsedSincePreviousTimestamp(timestamp, previousTimestamp);

	if (timeElapsedSincePreviousTrack <= 0) {
		loggerDebug(
			`${loggerAuxData} device has not moved in time, same timestamp received, loading lastest data...`,
		);

		return otherValidationsCallback();
	}

	if (previousLat === lat && previousLon === lon) {
		loggerDebug(
			`${loggerAuxData} device position not changed from previous, nothing to calculate, loading lastest data...`,
		);

		return otherValidationsCallback();
	}
};
