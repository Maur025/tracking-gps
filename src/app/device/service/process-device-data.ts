import { loggerWarn } from '@maur025/core-logger';
import { Device } from '../entity/device';
import { container } from 'tsyringe';
import DeviceCache from '../cache/device-cache';
import { Vehicle } from '@app/vehicle/entity/vehicle';
import { getDeviceVehicleData } from './get-device-vehicle-data';
import { getGeofencesDeviceIn } from '@app/geofence/service/verify-in/get-geofences-device-in';
import { DeviceGeofenceOut } from '../entity/device-geofence-out';
import { getGeofencesDeviceOut } from '@app/geofence/service/verify-out/get-geofences-device-out';
import { DeviceGeofenceIn } from '../entity/device-geofence-in';
import GeofenceInCache from '@app/geofence/cache/geofence-in-cache';
import { GeofenceIn } from '@app/geofence/entity/geofence-in';
import { DeviceGroup } from '../entity/device-group';
import { getDeviceGroups } from './get-device-groups';
import { getDeviceRules } from './get-device-rules';
import { processRulesByDevice } from '@app/rule/service/process-rules-by-device';
import { DeviceRuleAlertToLaunch } from '../entity/device-rule-alert-to-launch';

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

	const backupGeofenceInCacheMap = getBackupGeofenceInCacheMap(device.id);

	const geofenceInData: DeviceGeofenceIn = await getGeofencesDeviceIn({
		device,
		previousDeviceTrack: deviceInMapCache?.last,
	});

	const geofenceOutData: DeviceGeofenceOut = await getGeofencesDeviceOut({
		device,
		geofenceInFullList: geofenceInData.geofenceList,
		geofenceInPrevDataBackupMap: backupGeofenceInCacheMap,
		previousDeviceTrack: deviceInMapCache?.last,
	});

	const rulesAppliedList: string[] = await getDeviceRules({
		vehicleData,
		groups,
	});

	const deviceUpdated: Device = {
		...device,
		vehicleData,
		groups,
		geofencesIn: geofenceInData,
		geofencesOut: geofenceOutData,
		rulesApplied: rulesAppliedList,
	};

	const deviceRuleAlertToLaunchList: DeviceRuleAlertToLaunch[] =
		await processRulesByDevice({
			device: deviceUpdated,
			rulesToApply: rulesAppliedList,
		});

	return { ...deviceUpdated, alertsToLaunch: deviceRuleAlertToLaunchList };
};

const getBackupGeofenceInCacheMap = (
	deviceId: string,
): Map<string, GeofenceIn> => {
	const geofenceInCache = container.resolve(GeofenceInCache);
	const geofenceInCacheDataPrev: Map<string, GeofenceIn> | undefined =
		geofenceInCache.getCache().get(deviceId);

	return geofenceInCacheDataPrev ? new Map(geofenceInCacheDataPrev) : new Map();
};
