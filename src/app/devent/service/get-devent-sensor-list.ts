import { DeventSensorResponse } from '../dto/response/devent-sensor-response.js';
import { DeventSensor } from '../entity/devent-sensor.js';
import { ApiResponse } from '@maur025/core-model-data';
import { container } from 'tsyringe';
import DeventSensorService from './devent-sensor.service.js';
import { loggerError } from '@maur025/core-logger';
import { handleAsObject } from '@api-client/service/handle-response.js';
import { DeventSensorOperator } from '../entity/devent-sensor-operator.js';
import { SensorResponse } from '../dto/response/sensor-response.js';
import { Sensor } from '../entity/sensor.js';
import { SensorName } from '../entity/sensor-name.js';
import { CalcTypeResponse } from '../dto/response/calc-type-response.js';
import { CalcType } from '../entity/calc-type.js';

export const getDeventSensorList = async (
	sensorResponseList: DeventSensorResponse[],
): Promise<DeventSensor[]> => {
	if (!sensorResponseList?.length) {
		return [];
	}

	const deventSensorBatch: Promise<ApiResponse<DeventSensorResponse>>[] = [];

	const deventSensorService = container.resolve(DeventSensorService);

	for (const sensorResponse of sensorResponseList) {
		if (!sensorResponse.id) {
			continue;
		}

		deventSensorBatch.push(
			deventSensorService.getById({ id: sensorResponse.id }),
		);
	}

	if (!deventSensorBatch.length) {
		return [];
	}

	const batchResponse = await Promise.all(deventSensorBatch).catch(error => {
		loggerError(
			`[DEVENT] (getDeventSensorList) error fetching devent sensors: ${error}`,
		);

		return [];
	});

	return batchResponse
		.map((response: ApiResponse<DeventSensorResponse>) => {
			const deventSensorResponse =
				handleAsObject<DeventSensorResponse>(response);

			if (!deventSensorResponse) {
				return undefined;
			}

			const {
				id,
				devent_id,
				sensor_id,
				calctype_id,
				operator,
				value,
				userinput,
				sensor,
				calctype,
			} = deventSensorResponse;

			return {
				id,
				deventId: devent_id,
				sensorId: sensor_id,
				calcTypeId: calctype_id,
				operator: DeventSensorOperator.parse(operator),
				value,
				userInput: userinput,
				sensor: getSensorData(sensor),
				calcType: getCalcTypeData(calctype),
			};
		})
		.filter(deventSensor => deventSensor !== undefined);
};

const getSensorData = (sensorResponse?: SensorResponse): Sensor | undefined => {
	if (!sensorResponse) {
		return undefined;
	}

	const { id, name, description } = sensorResponse;

	return {
		id: Number(id),
		name: SensorName.parse(name),
		description,
	};
};

const getCalcTypeData = (
	calcTypeResponse?: CalcTypeResponse,
): CalcType | undefined => {
	if (!calcTypeResponse) {
		return undefined;
	}

	const { id, name, avg, delta, interval, time } = calcTypeResponse;

	return {
		id,
		name,
		avg: !!avg,
		delta: !!delta,
		interval,
		time,
	};
};
