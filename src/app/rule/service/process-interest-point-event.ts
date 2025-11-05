import { RuleResultEventComparison } from '../dto/rule-result-event-comparison.js';

export const processInterestPointEvent =
	async (): Promise<RuleResultEventComparison> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
