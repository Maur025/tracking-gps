import { RuleResultEventComparation } from '../dto/rule-result-event-comparison';

export const processSensorEvent =
	async (): Promise<RuleResultEventComparation> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
