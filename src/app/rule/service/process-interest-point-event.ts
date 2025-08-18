import { RuleResultEventComparation } from '../dto/rule-result-event-comparation';

export const processInterestPointEvent =
	async (): Promise<RuleResultEventComparation> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
