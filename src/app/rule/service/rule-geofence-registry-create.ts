import z, { array, object } from 'zod/v4';
import { container } from 'tsyringe';
import RuleGeofenceRegistryService from './rule-geofence-registry.service';
import { loggerDebug, loggerError } from '@maur025/core-logger';
import { RuleGeofenceRegistryCreateRequest } from '../dto/request/rule-geofence-registry-create-request';
import { forkJoin, lastValueFrom } from 'rxjs';
import { RuleGeofenceToRegistry } from '../dto/rule-geofence-to-registry';
import { ApiResponse } from '@maur025/core-model-data';
import { RuleGeofenceRegistryResponse } from '../dto/response/rule-geofence-registry-response';
import { handleAsObject } from '@api-client/service/handle-response';
import { DeviceRuleAlertToLaunch } from '@app/device/entity/device-rule-alert-to-launch';
import { Alert } from '@app/alert/entity/alert';
import { DeviceRuleAlertToLaunchType } from '@app/device/entity/device-rule-alert-to-launch-type';

const RuleGeofenceRegistryCreateReq = object({
	ruleGeofenceToRegistryList: array(RuleGeofenceToRegistry).default([]),
	alert: Alert.optional(),
});

type RuleGeofenceRegistryCreateReq = z.infer<
	typeof RuleGeofenceRegistryCreateReq
>;

const loggerAuxMessage: string = `[RULE] (ruleGeofenceRegistryCreate)`;

export const ruleGeofenceRegistryCreate = async (
	request: RuleGeofenceRegistryCreateReq,
): Promise<DeviceRuleAlertToLaunch[]> => {
	const { ruleGeofenceToRegistryList, alert } =
		RuleGeofenceRegistryCreateReq.parse(request);

	if (!ruleGeofenceToRegistryList?.length) {
		loggerDebug(`${loggerAuxMessage} no data to registry, skipping...`);

		return [];
	}

	const dataSaveList: RuleGeofenceRegistryCreateRequest[] = [];
	const ruleGeofenceRegistryService = container.resolve(
		RuleGeofenceRegistryService,
	);

	for (const { ruleGeofence, device, isIn } of ruleGeofenceToRegistryList) {
		if (!ruleGeofence.id || !device.id) {
			loggerError(`${loggerAuxMessage} required data not founded`);

			continue;
		}

		const { t = 0, lat = 0, lon = 0 } = device?.last || {};

		dataSaveList.push({
			rule_geofence_id: ruleGeofence.id,
			device_id: device.id,
			inout: isIn ? 1 : 0,
			timestamp: t,
			lat,
			lon,
		});
	}

	const responseList: ApiResponse<RuleGeofenceRegistryResponse>[] =
		await lastValueFrom(
			forkJoin(
				dataSaveList.map(data =>
					ruleGeofenceRegistryService.create<RuleGeofenceRegistryCreateRequest>(
						{
							data,
						},
					),
				),
			),
		);

	return responseList
		.map(response => {
			const ruleGeofenceRegistryResponse:
				| RuleGeofenceRegistryResponse
				| undefined = handleAsObject<RuleGeofenceRegistryResponse>(response);

			if (!ruleGeofenceRegistryResponse?.id) {
				return undefined;
			}

			return {
				alertType: DeviceRuleAlertToLaunchType.enum.GEOFENCE,
				ruleGeofenceRegistryId: ruleGeofenceRegistryResponse.id,
				alertId: alert?.id ?? null,
				isGeofenceIn: !!ruleGeofenceRegistryResponse.inout,
				ruleId: alert?.ruleId ?? '',
			};
		})
		.filter(value => value !== undefined);
};
