import { RuleResultEventComparison } from '../dto/rule-result-event-comparison.js';

export const processSensorEvent =
	async (): Promise<RuleResultEventComparison> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
