import { Device } from '@app/device/entity/device';
import z, { object } from 'zod/v4';
import { getPointInterestListByLocation } from './get-point-interest-list-by-location';
import { DevicePointInterestVisited } from '@app/device/entity/device-point-interest-visited';
import { VisitedPointInterest } from '../dto/visited-point-interest';
import { DeviceReconstructedRoad } from '@app/device/entity/device-reconstructed-road';
import { loggerDebug } from '@maur025/core-logger';

const GetVisitedOrNearbyPointsOfInterestRequest = object({
	device: Device,
	reconstructedRoad: DeviceReconstructedRoad,
});

type GetVisitedOrNearbyPointsOfInterestRequest = z.infer<
	typeof GetVisitedOrNearbyPointsOfInterestRequest
>;

const loggerAuxData: string = '[DEVICE] (getVisitedOrNearbyPointsOfInterest)';

export const getVisitedOrNearbyPointsOfInterest = async (
	request: GetVisitedOrNearbyPointsOfInterestRequest,
): Promise<DevicePointInterestVisited> => {
	const { device, reconstructedRoad } =
		GetVisitedOrNearbyPointsOfInterestRequest.parse(request);

	if (reconstructedRoad.statusOfRebuildRoad !== 'REBUILD_SUCCESS') {
		loggerDebug(
			`${loggerAuxData} omitting calculation by ${reconstructedRoad.statusOfRebuildRoad}.`,
		);
		return buildDevicePointInterestVisitedResponse([], []);
	}

	const pointInterestVisitedList = getPointInterestListByLocation({
		deviceLastTrack: device.last!,
		deviceId: device.id!,
		reconstructedRoad,
	});

	const stayingPointInterests = pointInterestVisitedList.filter(
		pointInterest => pointInterest.finalState === 'IN',
	);

	const passingPointInterests = pointInterestVisitedList.filter(
		pointInterest => pointInterest.finalState === 'IN_OUT',
	);

	loggerDebug(`${loggerAuxData} point interests interactions processed.`);

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
