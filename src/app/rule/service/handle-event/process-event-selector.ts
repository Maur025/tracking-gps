import { Devent } from '@app/devent/entity/devent';
import { Device } from '@app/device/entity/device';
import { RuleResultEventComparation } from '@app/rule/dto/rule-result-event-comparation';
import { Rule } from '@app/rule/entity/rule';
import z, { object } from 'zod/v4';
import { processGeofenceEvent } from '../process-geofence-event';
import { processInterestPointEvent } from '../process-interest-point-event';
import { processSensorEvent } from '../process-sensor-event';
import { loggerWarn } from '@maur025/core-logger';

const ProcessEventRequest = object({
	device: Device,
	devent: Devent,
	rule: Rule,
});

type ProcessEventRequest = z.infer<typeof ProcessEventRequest>;

export const processEventSelector = async (
	request: ProcessEventRequest,
): Promise<RuleResultEventComparation> => {
	const { devent, device, rule } = ProcessEventRequest.parse(request);

	switch (devent.deventType) {
		case 'GEOFENCES': {
			return processGeofenceEvent({ device, rule });
		}
		case 'INTEREST_POINTS': {
			return processInterestPointEvent();
		}
		case 'SENSORS': {
			return processSensorEvent();
		}
		default: {
			loggerWarn(
				`[RULE] (processEventSelector) devent type unknowned, skipping...`,
			);

			return { alertToLaunchList: [], wasTriggered: false };
		}
	}
};
