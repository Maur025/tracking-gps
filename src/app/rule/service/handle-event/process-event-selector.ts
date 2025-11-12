import { Devent } from '@app/devent/entity/devent.js';
import { Device } from '@app/device/entity/device.js';
import { RuleResultEventComparison } from '@app/rule/dto/rule-result-event-comparison.js';
import { Rule } from '@app/rule/entity/rule.js';
import z, { object } from 'zod/v4';
import { processGeofenceEvent } from '../process-geofence-event.js';
import { processInterestPointEvent } from '../process-interest-point-event.js';
import { processSensorEvent } from '../process-sensor-event.js';
import { loggerWarn } from '@maur025/core-logger';
import { RuleEvent } from '@app/rule/entity/rule-event.js';

const ProcessEventRequest = object({
	device: Device,
	devent: Devent,
	rule: Rule,
	event: RuleEvent,
});

type ProcessEventRequest = z.infer<typeof ProcessEventRequest>;

export const processEventSelector = (
	request: ProcessEventRequest,
): RuleResultEventComparison => {
	const { devent, device, rule, event } = ProcessEventRequest.parse(request);

	switch (devent.deventType) {
		case 'GEOFENCES': {
			return processGeofenceEvent({ device, rule });
		}
		case 'INTEREST_POINTS': {
			return processInterestPointEvent({ device, rule });
		}
		case 'SENSORS': {
			return processSensorEvent({ devent, device, rule, event });
		}
		default: {
			loggerWarn(
				`[RULE] (processEventSelector) devent type unknown, skipping...`,
			);

			return { alertToLaunchList: [], wasTriggered: false };
		}
	}
};
