import { Device } from '@app/device/entity/device';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import GeofenceCache from '@app/geofence/cache/geofence-cache';
import { Geofence } from '@app/geofence/entity/geofence';
import { DeviceNotificationSchema } from '@app/notification/schema/device-notification.schema';
import { Rule } from '@app/rule/entity/rule';
import { container } from 'tsyringe';
import z, { object } from 'zod/v4';

const NotificationBuildByAlertListRequest = object({
	deviceAlertToLaunchList: z.array(DeviceRuleAlertToLaunch),
	device: Device,
	rule: Rule,
});

type NotificationBuildByAlertListRequest = z.infer<
	typeof NotificationBuildByAlertListRequest
>;

export const notificationBuildByAlertList = (
	request: NotificationBuildByAlertListRequest,
): DeviceNotificationSchema => {
	const { deviceAlertToLaunchList, device, rule } =
		NotificationBuildByAlertListRequest.parse(request);

	const geofenceInNames: string[] = [];
	const geofenceOutNames: string[] = [];
	const ruleGeofenceRegistryIds: string[] = [];
	const ruleRegistryStates: string[] = [];

	const geofenceCache = container.resolve(GeofenceCache);

	for (const deviceAlert of deviceAlertToLaunchList) {
		if (deviceAlert.alertType === 'STATE') {
			ruleRegistryStates.push(deviceAlert.ruleRegistryStatesId ?? 'N/A');
			continue;
		}

		ruleGeofenceRegistryIds.push(deviceAlert.ruleGeofenceRegistryId ?? 'N/A');

		const geofenceData: Geofence | undefined = geofenceCache.getById(
			deviceAlert.geofenceId ?? '',
		);

		if (!geofenceData) {
			continue;
		}

		if (deviceAlert.isGeofenceIn) {
			geofenceInNames.push(geofenceData.name ?? 'N/A');
		} else {
			geofenceOutNames.push(geofenceData.name ?? 'N/A');
		}
	}

	const { states, vehicleData, last } = device;

	return {
		deviceId: device.id ?? 'N/A',
		ruleId: rule.id ?? 'N/A',
		vehicleId: vehicleData?.id ?? 'N/A',
		ruleDescription: rule.description ?? 'N/A',
		ruleName: rule.name ?? 'N/A',
		vehicleName: vehicleData?.name ?? 'N/A',
		vehiclePlaca: vehicleData?.metadata?.plaque ?? 'N/A',
		groupNames: device?.groups?.map(group => group.name).join(' | ') ?? 'N/A',
		withSpeed: states?.SPEED ?? 'N/A',
		withFuel: states?.FUEL_LEVEL ? states?.FUEL_LEVEL?.toString() : 'N/A',
		withGeofenceIn: geofenceInNames.join(' | ') ?? 'N/A',
		withGeofenceOut: geofenceOutNames.join(' | ') ?? 'N/A',
		withBattery: states?.BATTERY_EXTERNAL ?? 'N/A',
		withIgnition: states?.IGNITION ?? 'N/A',
		withInOut: rule.inout ?? 'N/A',
		withLat: last?.lat ? last?.lat.toString() : 'N/A',
		withLon: last?.lon ? last?.lon.toString() : 'N/A',
		withTimestamp: last?.t ? new Date(last?.t).toISOString() : 'N/A',
		ruleGeofenceRegistryIds,
		ruleRegistryStates,
	};
};
