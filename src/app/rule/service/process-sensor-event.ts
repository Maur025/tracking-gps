import { RuleResultEventComparation } from '../dto/rule-result-event-comparation';

export const processSensorEvent =
	async (): Promise<RuleResultEventComparation> => {
		return { alertToLaunchList: [], wasTriggered: false };
	};
