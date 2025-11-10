import z, { object } from 'zod';
import { RuleResultEventComparison } from '../dto/rule-result-event-comparison.js';
import { Rule } from '../entity/rule.js';
import { Device } from '@app/device/entity/device.js';
import { Devent } from '@app/devent/entity/devent.js';
import { loggerDebug } from '@maur025/core-logger';
import { RuleEvent } from '../entity/rule-event.js';
import { DeviceStateDifference } from '@app/device/entity/device-state-difference.js';
import { DeventSensorOperator } from '@app/devent/entity/devent-sensor-operator.js';

const ProcessSensorEventRequest = object({
	rule: Rule,
	device: Device,
	devent: Devent,
	event: RuleEvent,
});

type ProcessSensorEventRequest = z.infer<typeof ProcessSensorEventRequest>;

const loggerAuxMessage: string = `[RULE] (processSensorEvent)`;

export const processSensorEvent = async (
	request: ProcessSensorEventRequest,
): Promise<RuleResultEventComparison> => {
	const { device, devent, event } = ProcessSensorEventRequest.parse(request);

	if (!device.differenceStates?.length) {
		loggerDebug(`${loggerAuxMessage} device has no detected change states.`);

		return { alertToLaunchList: [], wasTriggered: false };
	}

	const differentStateMap = new Map<string, DeviceStateDifference>(
		device.differenceStates?.map(differenceState => [
			differenceState.stateName,
			differenceState,
		]),
	);

	const sensorMatchList = devent.sensors
		.filter(
			sensor =>
				sensor.sensor?.name && differentStateMap.has(sensor.sensor?.name),
		)
		.map(sensor => sensor);

	if (!sensorMatchList.length) {
		loggerDebug(
			`${loggerAuxMessage} no matching sensors found in device state differences.`,
		);

		return { alertToLaunchList: [], wasTriggered: false };
	}

	for (const sensor of sensorMatchList) {
		const differenceState = differentStateMap.get(sensor.sensor!.name);

		if (!differenceState) {
			continue;
		}

		if (Number.isNaN(differenceState.currentValue)) {
			continue;
		}

		const wasTriggered = processByOperator(
			sensor.operator,
			Number(differenceState.currentValue),
			event.value,
		);

		console.log({ resultOfComparison: wasTriggered });
	}

	// console.log(devent);
	// console.log(devent.sensors);
	// console.log(event);

	// console.log(sensorMatchList);

	return { alertToLaunchList: [], wasTriggered: false };
};

const processByOperator = (
	operator: DeventSensorOperator,
	valueToCompare: number,
	eventValue: string,
) => {
	let resultOfComparison: boolean = false;
	let ruleValue: number = 0;
	let ruleValueAux: number = 0;

	if (Number.isNaN(eventValue) && eventValue.includes(',')) {
		const [min, max] = eventValue.split(',');
		ruleValue = Number.isNaN(min) ? 0 : Number(min);
		ruleValueAux = Number.isNaN(max) ? 0 : Number(max);
	} else {
		ruleValue = Number(eventValue);
	}

	switch (operator) {
		case '>=': {
			resultOfComparison = valueToCompare >= ruleValue;
			break;
		}
		case '<=': {
			resultOfComparison = valueToCompare <= ruleValue;
			break;
		}
		case '<': {
			resultOfComparison = valueToCompare < ruleValue;
			break;
		}
		case '>': {
			resultOfComparison = valueToCompare > ruleValue;
			break;
		}
		case '=': {
			resultOfComparison = valueToCompare === ruleValue;
			break;
		}
		case '!=': {
			resultOfComparison = valueToCompare !== ruleValue;
			break;
		}
		case '<>': {
			resultOfComparison =
				valueToCompare > ruleValue && valueToCompare < ruleValueAux;
			break;
		}
		default: {
			resultOfComparison = false;
		}
	}

	return resultOfComparison;
};
