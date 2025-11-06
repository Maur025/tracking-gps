import z, { object } from 'zod';
import { RuleResultEventComparison } from '../dto/rule-result-event-comparison.js';
import { Device } from '@app/device/entity/device.js';
import { Rule } from '../entity/rule.js';
import { loggerDebug } from '@maur025/core-logger';
import { RuleGeofenceToRegistry } from '../dto/rule-geofence-to-registry.js';
import { ruleGeofenceRegistryCreate } from './rule-geofence-registry-create.js';

const ProcessInterestPointEventRequest = object({
	device: Device,
	rule: Rule,
});

type ProcessInterestPointEventRequest = z.infer<
	typeof ProcessInterestPointEventRequest
>;

const loggerAuxMessage = '[RULE] (processInterestPointEvent)';

export const processInterestPointEvent = async (
	request: ProcessInterestPointEventRequest,
): Promise<RuleResultEventComparison> => {
	const { device, rule } = ProcessInterestPointEventRequest.parse(request);

	if (!rule.ipoints?.length) {
		loggerDebug(`${loggerAuxMessage} No interest points found in rule.`);

		return { alertToLaunchList: [], wasTriggered: false };
	}

	if (!device.pointInterestVisited?.passingList?.length) {
		loggerDebug(
			`${loggerAuxMessage} No interest point interactions found in device.`,
		);

		return { alertToLaunchList: [], wasTriggered: false };
	}

	const interestPointInteractionSet = new Set<string>(
		device.pointInterestVisited?.passingList?.map(
			({ pointInterestId }) => pointInterestId,
		),
	);

	const ruleInterestPointToRegistryList: RuleGeofenceToRegistry[] = [];

	for (const interestPoint of rule.ipoints) {
		if (!interestPointInteractionSet.has(interestPoint.geofenceId)) {
			continue;
		}

		ruleInterestPointToRegistryList.push({
			ruleGeofence: interestPoint,
			device,
			isIn: true,
		});

		ruleInterestPointToRegistryList.push({
			ruleGeofence: interestPoint,
			device,
			isIn: false,
		});
	}

	if (!ruleInterestPointToRegistryList?.length) {
		loggerDebug(
			`${loggerAuxMessage} no data interest point to registry, skipping...`,
		);

		return { alertToLaunchList: [], wasTriggered: false };
	}

	const deviceRuleAlertToLaunchList = await ruleGeofenceRegistryCreate({
		ruleGeofenceToRegistryList: ruleInterestPointToRegistryList,
		alert: rule?.alerts[0],
	});

	return {
		alertToLaunchList: deviceRuleAlertToLaunchList,
		wasTriggered: !!deviceRuleAlertToLaunchList.length,
	};
};
