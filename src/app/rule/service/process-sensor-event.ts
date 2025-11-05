import { RuleResultEventComparison } from '../dto/rule-result-event-comparison';

export const processSensorEvent =
	async (): Promise<RuleResultEventComparison> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
