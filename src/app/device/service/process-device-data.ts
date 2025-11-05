import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device.js';
import { container } from 'tsyringe';
import DeviceCache from '../cache/device-cache.js';
import { Vehicle } from '@app/vehicle/entity/vehicle.js';
import { getDeviceVehicleData } from './get-device-vehicle-data.js';
import { getGeofencesDeviceIn } from '@app/geofence/service/verify-in/get-geofences-device-in.js';
import { DeviceGeofenceOut } from '../entity/device-geofence-out.js';
import { getGeofencesDeviceOut } from '@app/geofence/service/verify-out/get-geofences-device-out.js';
import { DeviceGeofenceIn } from '../entity/device-geofence-in.js';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache.js';
import { GeofenceIn } from '@app/geofence/entity/geofence-in.js';
import { DeviceGroup } from '../entity/device-group.js';
import { getDeviceGroups } from './get-device-groups.js';
import { getDeviceRules } from './get-device-rules.js';
import { processRulesByDevice } from '@app/rule/service/process-rules-by-device.js';
import { DeviceRuleAlertToLaunch } from '../entity/device-rule-alert-to-launch.js';
import { getVisitedOrNearbyPointsOfInterest } from '@app/point-interest/service/get-visited-or-nearby-points-interest.js';
import { calculateGpsDirection } from './calculate-gps-direction.js';
import { rebuildRoadBetweenTracks } from './rebuild-road-between-tracks.js';
import { getChangesInDeviceStates } from '@app/devent/service/get-changes-in-device-states.js';

export const processDeviceData = async (
	device: Device,
): Promise<Device | null> => {
	if (!device?.id) {
		loggerWarn(
			`[DEVICE] (processDeviceData) device id is undefined or empty. Skipping... `,
		);

		return null;
	}

	const deviceCache = container.resolve(DeviceCache);
	const deviceInMapCache: Device | undefined = deviceCache.getById(device.id);

	const vehicleData: Vehicle | undefined = await getDeviceVehicleData(
		device,
		deviceInMapCache,
	);

	const groups: DeviceGroup[] = await getDeviceGroups(vehicleData);

	const deviceMovingDirection = calculateGpsDirection({
		deviceId: device.id,
		previousTrack: deviceInMapCache?.last,
		track: device.last,
		previousDeviceMovingDirection: deviceInMapCache?.movingDirection,
	});

	const reconstructedRoad = await rebuildRoadBetweenTracks({
		deviceId: device.id,
		previousTrack: deviceInMapCache?.last,
		currentTrack: device.last,
		movingDirection: deviceMovingDirection,
	});

	const backupGeofenceInCacheMap = getBackupGeofenceInCacheMap(device.id);

	const geofenceInData: DeviceGeofenceIn = await getGeofencesDeviceIn({
		device,
		reconstructedRoad,
	});

	const geofenceOutData: DeviceGeofenceOut = await getGeofencesDeviceOut({
		geofenceInFullList: geofenceInData.geofenceList,
		geofenceInPrevDataBackupMap: backupGeofenceInCacheMap,
		reconstructedRoad,
	});

	const visitedOrNearbyPointsOfInterest =
		await getVisitedOrNearbyPointsOfInterest({
			device,
			reconstructedRoad,
		});

	const differenceStates = getChangesInDeviceStates({
		states: device.states,
		previousDifferenceStateList: deviceInMapCache?.differenceStates ?? [],
	});

	const rulesAppliedList: string[] = await getDeviceRules({
		vehicleData,
		groups,
	});

	const deviceUpdated: Device = {
		...device,
		vehicleData,
		groups,
		movingDirection: deviceMovingDirection,
		reconstructedRoad,
		geofencesIn: geofenceInData,
		geofencesOut: geofenceOutData,
		rulesApplied: rulesAppliedList,
		pointInterestVisited: visitedOrNearbyPointsOfInterest,
		previousTrack: deviceInMapCache?.last,
		differenceStates,
	};

	const deviceRuleAlertToLaunchList: DeviceRuleAlertToLaunch[] =
		await processRulesByDevice({
			device: deviceUpdated,
			rulesToApply: rulesAppliedList,
		});

	return {
		...deviceUpdated,
		alertsToLaunch: deviceRuleAlertToLaunchList,
		trackReceivedAt: deviceUpdated.last?.t
			? new Date(deviceUpdated.last.t).toISOString()
			: 'N/A',
	};
};

const getBackupGeofenceInCacheMap = (
	deviceId: string,
): Map<string, GeofenceIn> => {
	const geofenceInCache = container.resolve(GeofenceInCache);
	const geofenceInCacheDataPrev: Map<string, GeofenceIn> | undefined =
		geofenceInCache.getCache().get(deviceId);

	return geofenceInCacheDataPrev ? new Map(geofenceInCacheDataPrev) : new Map();
};
