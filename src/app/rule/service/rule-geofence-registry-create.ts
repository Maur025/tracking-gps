import z, { array, object } from 'zod/v4';
import { container } from 'tsyringe';
import RuleGeofenceRegistryService from './rule-geofence-registry.service.js';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { RuleGeofenceRegistryCreateRequest } from '../dto/request/rule-geofence-registry-create-request.js';
import { RuleGeofenceRegistryResponse } from '../dto/response/rule-geofence-registry-response.js';
import { handleAsObject } from '@api-client/service/handle-response.js';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch.js';

const RuleGeofenceRegistryCreateReq = object({
	ruleGeofenceAlertList: array(DeviceRuleAlertToLaunch).default([]),
});

type RuleGeofenceRegistryCreateReq = z.infer<
	typeof RuleGeofenceRegistryCreateReq
>;

const loggerAuxMessage: string = `[RULE] (ruleGeofenceRegistryCreate)`;

export const ruleGeofenceRegistryCreate = async (
	request: RuleGeofenceRegistryCreateReq,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { ruleGeofenceAlertList } =
		RuleGeofenceRegistryCreateReq.parse(request);

	if (!ruleGeofenceAlertList?.length) {
		loggerDebug(`${loggerAuxMessage} no data to registry, skipping...`);

		return [];
	}

	const ruleGeofenceRegistryService = container.resolve(
		RuleGeofenceRegistryService,
	);

	const responseList = await Promise.all(
		ruleGeofenceAlertList.map(ruleGeofenceAlert =>
			ruleGeofenceRegistryService.create<RuleGeofenceRegistryCreateRequest>({
				data: {
					rule_geofence_id: ruleGeofenceAlert.ruleGeofenceId ?? '',
					geofence_id: ruleGeofenceAlert.geofenceId ?? '',
					device_id: ruleGeofenceAlert.deviceId ?? '',
					inout: ruleGeofenceAlert.isGeofenceIn ? 1 : 0,
					timestamp: ruleGeofenceAlert.timestamp ?? 0,
					lat: ruleGeofenceAlert.lat ?? 0,
					lon: ruleGeofenceAlert.lon ?? 0,
				},
			}),
		),
	).catch(error => {
		loggerError(`${loggerAuxMessage} error in fetch all geofences`, error);

		return undefined;
	});

	if (!responseList) {
		loggerDebug(
			`${loggerAuxMessage} no response from rule geofence registry create.`,
		);

		return [];
	}

	return ruleGeofenceAlertList
		.map((ruleGeofenceAlert, index) => {
			if (responseList[index] === undefined) {
				return undefined;
			}

			const responseData = handleAsObject<RuleGeofenceRegistryResponse>(
				responseList[index],
			);

			return {
				...ruleGeofenceAlert,
				ruleGeofenceRegistryId: responseData?.id,
			};
		})
		.filter(ruleGeofenceAlert => ruleGeofenceAlert !== undefined);
};
