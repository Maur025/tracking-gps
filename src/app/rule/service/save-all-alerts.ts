import { DeviceRuleAlertToLaunchType } from '@app/device/entity/device-rule-alert-to-launch-type.js';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';
import { loggerDebug } from '@maur025/core-logger';
import z, { array, object } from 'zod';
import { ruleGeofenceRegistryCreate } from './rule-geofence-registry-create.js';
import { ruleRegistryStateCreate } from './rule-registry-state-create.js';

const SaveAllAlertRequest = object({
	alertToSaveList: array(DeviceRuleAlertToLaunch).default([]),
});

type SaveAllAlertRequest = z.infer<typeof SaveAllAlertRequest>;

export const saveAllAlerts = async (
	request: SaveAllAlertRequest,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { alertToSaveList } = SaveAllAlertRequest.parse(request);

	if (!alertToSaveList.length) {
		loggerDebug(`[RULE] (saveAllAlerts) no alerts to save.`);
		return [];
	}

	const ruleGeofenceToRegisterList = alertToSaveList.filter(
		alertToLaunch =>
			alertToLaunch.alertType === DeviceRuleAlertToLaunchType.enum.GEOFENCE,
	);

	const ruleStateToRegisterList = alertToSaveList.filter(
		alertToLaunch =>
			alertToLaunch.alertType === DeviceRuleAlertToLaunchType.enum.STATE,
	);

	const responseGeofenceRegistryList = await ruleGeofenceRegistryCreate({
		ruleGeofenceAlertList: ruleGeofenceToRegisterList,
	});

	const responseStateRegistryList = await ruleRegistryStateCreate({
		ruleStateAlertList: ruleStateToRegisterList,
	});

	return [...responseGeofenceRegistryList, ...responseStateRegistryList];
};
