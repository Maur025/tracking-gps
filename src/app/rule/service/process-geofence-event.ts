import { Device } from '@app/device/entity/device.js';
import z, { array, object, set, string } from 'zod/v4';
import { Rule } from '../entity/rule.js';
import { RuleGeofenceToRegistry } from '../dto/rule-geofence-to-registry.js';
import { RuleInoutSchema } from '../entity/rule-inout-schema.js';
import { RuleGeofence } from '../entity/rule-geofence.js';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';
import { RuleResultEventComparison } from '../dto/rule-result-event-comparison.js';
import { loggerDebug } from '@maur025/core-logger';
import { DeviceRuleAlertToLaunchType } from '@app/device/entity/device-rule-alert-to-launch-type.js';

const ProcessGeofenceEventRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessGeofenceEventRequest = z.infer<typeof ProcessGeofenceEventRequest>;

const loggerAuxMessage: string = `[RULE] (processGeofenceEvent)`;

export const processGeofenceEvent = (
	request: ProcessGeofenceEventRequest,
): RuleResultEventComparison => {
	const { device, rule } = ProcessGeofenceEventRequest.parse(request);

	if (!rule.geofences?.length) {
		loggerDebug(`${loggerAuxMessage} no geofences defined in rule.`);
		return {
			alertToLaunchList: [],
			wasTriggered: false,
		};
	}

	const geofenceInSet: Set<string> = new Set<string>(
		device.geofencesIn?.newGeofenceInList?.map(({ geofenceId }) => geofenceId),
	);

	const geofenceOutSet: Set<string> = new Set<string>(
		device?.geofencesOut?.geofenceList?.map(({ geofenceId }) => geofenceId),
	);

	const ruleGeofenceToRegistryList: RuleGeofenceToRegistry[] =
		getRuleGeofenceToRegistryList({
			inout: rule.inout,
			device,
			geofenceInSet,
			geofenceOutSet,
			ruleGeofences: rule.geofences,
		});

	if (!ruleGeofenceToRegistryList?.length) {
		loggerDebug(
			`${loggerAuxMessage} no data geofence IN,OUT or INOUT to registry, skipping...`,
		);

		return {
			alertToLaunchList: [],
			wasTriggered: false,
		};
	}

	const { lat, lon, t: timestamp } = device.last ?? {};

	const deviceRuleAlertToLaunchList: DeviceRuleAlertToLaunch[] =
		ruleGeofenceToRegistryList.map(({ ruleGeofence, isIn }) => ({
			ruleId: rule.id ?? '',
			alertId: rule.alerts?.[0]?.id ?? '',
			alertType: DeviceRuleAlertToLaunchType.enum.GEOFENCE,
			deviceId: device.id,
			geofenceId: ruleGeofence.geofenceId,
			ruleGeofenceId: ruleGeofence.id,
			isGeofenceIn: isIn,
			timestamp,
			lat,
			lon,
		}));

	return {
		alertToLaunchList: deviceRuleAlertToLaunchList,
		wasTriggered: !!deviceRuleAlertToLaunchList.length,
	};
};

const GetRuleGeofenceToRegistryListRequest = object({
	inout: RuleInoutSchema.nullable(),
	device: Device,
	geofenceInSet: set(string()),
	geofenceOutSet: set(string()),
	ruleGeofences: array(RuleGeofence).default([]),
});

type GetRuleGeofenceToRegistryListRequest = z.infer<
	typeof GetRuleGeofenceToRegistryListRequest
>;

const getRuleGeofenceToRegistryList = (
	request: GetRuleGeofenceToRegistryListRequest,
): RuleGeofenceToRegistry[] => {
	const { inout, device, geofenceInSet, geofenceOutSet, ruleGeofences } =
		GetRuleGeofenceToRegistryListRequest.parse(request);

	const ruleGeofenceToRegistryList: RuleGeofenceToRegistry[] = [];

	for (const ruleGeofence of ruleGeofences) {
		switch (inout) {
			case 'in': {
				if (!geofenceInSet.has(ruleGeofence.geofenceId)) {
					ruleGeofenceToRegistryList.push({ ruleGeofence, device, isIn: true });

					continue;
				}

				continue;
			}
			case 'out': {
				if (!geofenceOutSet.has(ruleGeofence.geofenceId)) {
					ruleGeofenceToRegistryList.push({
						ruleGeofence,
						device,
						isIn: false,
					});

					continue;
				}

				continue;
			}
			case 'inout': {
				if (geofenceInSet.has(ruleGeofence.geofenceId)) {
					ruleGeofenceToRegistryList.push({ ruleGeofence, device, isIn: true });
				}

				if (geofenceOutSet.has(ruleGeofence.geofenceId)) {
					ruleGeofenceToRegistryList.push({
						ruleGeofence,
						device,
						isIn: false,
					});
				}

				continue;
			}
			default: {
				continue;
			}
		}
	}

	return ruleGeofenceToRegistryList;
};
