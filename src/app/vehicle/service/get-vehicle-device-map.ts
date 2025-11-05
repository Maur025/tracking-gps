import { GroupVehicleResponse } from '@app/group/dto/response/group-vehicle-response.js';
import { container } from 'tsyringe';
import z, { array, object } from 'zod/v4';
import VehicleService from './vehicle.service.js';
import {
	forkJoin,
	from,
	lastValueFrom,
	map,
	mergeMap,
	Observable,
	toArray,
} from 'rxjs';
import { VehicleResponse } from '../dto/response/vehicle-response.js';
import { ApiResponse } from '@maur025/core-model-data';
import { handleAsArray } from '@api-client/service/handle-response.js';

const Request = object({
	groupVehicles: array(GroupVehicleResponse),
});

type Request = z.infer<typeof Request>;

export const getVehicleDeviceMap = async ({ groupVehicles }: Request) => {
	Request.parse({ groupVehicles });

	const batchSize: number = 50;
	const vehicleService = container.resolve(VehicleService);

	const vehicleQueries$: Observable<ApiResponse<VehicleResponse>>[] =
		groupVehicles.map(({ vehicle: { id = '' } }) =>
			vehicleService.getById({ id }),
		);

	const batches$: Observable<ApiResponse<VehicleResponse>>[][] = [];

	const vehicleDeviceMap: Map<string, string> = new Map<string, string>();

	for (let index = 0; index < vehicleQueries$.length; index += batchSize) {
		batches$.push(vehicleQueries$.slice(index, index + batchSize));
	}

	await lastValueFrom(
		from(batches$).pipe(
			mergeMap(batch => forkJoin(batch)),
			toArray(),
			map((responseBatchList: ApiResponse<VehicleResponse>[][]) => {
				for (const responseBatch of responseBatchList) {
					for (const response of responseBatch) {
						const responseDataList = handleAsArray(response);

						if (!responseDataList[0]?.device?.length) {
							continue;
						}

						const deviceId: string =
							responseDataList[0]?.device[0]?.device_id || '';
						const vehicleId: string =
							responseDataList[0]?.device[0]?.vehicle_id || '';

						vehicleDeviceMap.set(vehicleId, deviceId);
					}
				}

				return;
			}),
		),
	);

	return vehicleDeviceMap;
};
