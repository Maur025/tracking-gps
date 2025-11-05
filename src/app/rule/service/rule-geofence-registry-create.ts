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
			geofence_id: ruleGeofence.geofenceId,
			device_id: device.id,
			inout: isIn ? 1 : 0,
			timestamp: t,
			lat,
			lon,
		});
	}

	const dataSaveMap = new Map<string, RuleGeofenceRegistryCreateRequest>(
		dataSaveList.map(dataSave => [dataSave.rule_geofence_id, dataSave]),
	);

	const responseList: ApiResponse<RuleGeofenceRegistryResponse>[] | void =
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
		).catch(error => {
			loggerError(`${loggerAuxMessage} error in forkJoin`, error);
			loggerDebug(`${loggerAuxMessage} error in forkJoin: ${error}`);
		});

	return !responseList
		? []
		: responseList
				?.map(response => {
					const ruleGeofenceRegistryResponse:
						| RuleGeofenceRegistryResponse
						| undefined =
						handleAsObject<RuleGeofenceRegistryResponse>(response);

					if (!ruleGeofenceRegistryResponse?.id) {
						return undefined;
					}

					const dataSave = dataSaveMap.get(
						ruleGeofenceRegistryResponse.rule_geofence_id,
					);

					return {
						ruleGeofenceRegistryId: ruleGeofenceRegistryResponse.id,
						alertId: alert?.id ?? null,
						ruleId: alert?.ruleId ?? '',
						deviceId: dataSave?.device_id,
						geofenceId: dataSave?.geofence_id,
						alertType: DeviceRuleAlertToLaunchType.enum.GEOFENCE,
						isGeofenceIn: !!ruleGeofenceRegistryResponse.inout,
						timestamp: dataSave?.timestamp,
						lat: dataSave?.lat,
						lon: dataSave?.lon,
					};
				})
				.filter(value => value !== undefined);
};
