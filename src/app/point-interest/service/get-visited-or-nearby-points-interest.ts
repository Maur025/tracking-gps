import { Device } from '@app/device/entity/device';
import { validateToIgnoreDevicePositionCalculate } from '@app/device/service/validate-to-ignore-device-position-calculate';
import { Track } from '@app/track/entity/track';
import z, { object } from 'zod/v4';
import { getPointInterestListByLocation } from './get-point-interest-list-by-location';
import { DevicePointInterestVisited } from '@app/device/entity/device-point-interest-visited';
import { VisitedPointInterest } from '../dto/visited-point-interest';
import { DeviceMovingDirection } from '@app/device/entity/device-moving-direction';

const GetVisitedOrNearbyPointsOfInterestRequest = object({
	device: Device,
	previousDeviceTrack: Track.optional(),
	movingDirection: DeviceMovingDirection,
});

type GetVisitedOrNearbyPointsOfInterestRequest = z.infer<
	typeof GetVisitedOrNearbyPointsOfInterestRequest
>;

const loggerAuxData: string = '[DEVICE] (getVisitedOrNearbyPointsOfInterest)';

export const getVisitedOrNearbyPointsOfInterest = async (
	request: GetVisitedOrNearbyPointsOfInterestRequest,
): Promise<DevicePointInterestVisited> => {
	const { device, previousDeviceTrack, movingDirection } =
		GetVisitedOrNearbyPointsOfInterestRequest.parse(request);

	const resultOfValidation =
		validateToIgnoreDevicePositionCalculate<DevicePointInterestVisited>({
			device,
			previousDeviceTrack,
			loggerAuxData,
			noIdCallback: () => buildDevicePointInterestVisitedResponse([], []),
			otherValidationsCallback: () =>
				buildDevicePointInterestVisitedResponse([], []),
		});

	if (resultOfValidation) {
		return resultOfValidation;
	}

	const pointInterestVisitedList = getPointInterestListByLocation({
		deviceLastTrack: device.last!,
		deviceId: device.id!,
		previousDeviceTrack,
		movingDirection,
	});

	const stayingPointInterests = pointInterestVisitedList.filter(
		pointInterest => pointInterest.finalState === 'IN',
	);

	const passingPointInterests = pointInterestVisitedList.filter(
		pointInterest => pointInterest.finalState === 'IN_OUT',
	);

	return buildDevicePointInterestVisitedResponse(
		stayingPointInterests,
		passingPointInterests,
	);
};

const buildDevicePointInterestVisitedResponse = (
	pointInterestStayingList: VisitedPointInterest[],
	pointInterestPassingList: VisitedPointInterest[],
): DevicePointInterestVisited => ({
	total: pointInterestStayingList.length + pointInterestPassingList.length,
	passingList: pointInterestPassingList,
	passingTotal: pointInterestPassingList.length,
	stayList: pointInterestStayingList,
	stayTotal: pointInterestStayingList.length,
});
