import { RuleResultEventComparation } from '../dto/rule-result-event-comparison';

export const processInterestPointEvent =
	async (): Promise<RuleResultEventComparation> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
