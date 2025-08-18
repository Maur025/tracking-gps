import { Device } from '@app/device/entity/device';
import z, { array, object, set, string } from 'zod/v4';
import { Rule } from '../entity/rule';
import { RuleGeofenceToRegistry } from '../dto/rule-geofence-to-registry';
import { RuleInoutSchema } from '../entity/rule-inout-schema';
import { RuleGeofence } from '../entity/rule-geofence';
import { ruleGeofenceRegistryCreate } from './rule-geofence-registry-create';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { RuleResultEventComparation } from '../dto/rule-result-event-comparation';
import { loggerDebug } from '@maur025/core-logger';

const ProcessGeofenceEventRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessGeofenceEventRequest = z.infer<typeof ProcessGeofenceEventRequest>;

export const processGeofenceEvent = async (
	request: ProcessGeofenceEventRequest,
): Promise<RuleResultEventComparation> => {
	const { device, rule } = ProcessGeofenceEventRequest.parse(request);

	if (!rule.geofences?.length) {
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
			`[RULE] (processGeofenceEvent) no data to registry, skipping...`,
		);

		return {
			alertToLaunchList: [],
			wasTriggered: false,
		};
	}

	const deviceRuleAlertToLaunchList: DeviceRuleAlertToLaunch[] =
		await ruleGeofenceRegistryCreate({
			ruleGeofenceToRegistryList,
			alert: rule?.alerts[0],
		});

	return { alertToLaunchList: deviceRuleAlertToLaunchList, wasTriggered: true };
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
