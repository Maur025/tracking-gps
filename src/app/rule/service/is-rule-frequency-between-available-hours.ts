import z, { object } from 'zod/v4';
import { RuleFrequency } from '../entity/rule-frequency';

const IsRuleFrequencybetweenAvailableHoursSchema = object({
	frequency: RuleFrequency,
});

type IsRuleFrequencybetweenAvailableHoursRequest = z.infer<
	typeof IsRuleFrequencybetweenAvailableHoursSchema
>;

export const isRuleFrequencyBetweenAvailableHours = (
	request: IsRuleFrequencybetweenAvailableHoursRequest,
): boolean => {
	const { frequency } =
		IsRuleFrequencybetweenAvailableHoursSchema.parse(request);

	const currentTimestamp: number = Date.now();

	const onlyHoursCurrent: number = getSecondsFromTimestamp(currentTimestamp);
	const onlyHoursStartTime: number = getSecondsFromTimestamp(
		frequency.startTime,
	);
	const onlyHoursEndTime: number = getSecondsFromTimestamp(frequency.endTime);

	if (
		onlyHoursStartTime <= onlyHoursCurrent &&
		onlyHoursCurrent <= onlyHoursEndTime
	) {
		return true;
	}

	return false;
};

const getSecondsFromTimestamp = (timestamp: number): number => {
	const date = new Date(timestamp);

	const hoursAsSeconds: number = date.getHours() * 3600;
	const minutesAsSeconds: number = date.getMinutes() * 60;

	const onlyHoursTimestamp: number =
		hoursAsSeconds + minutesAsSeconds + date.getSeconds();

	return onlyHoursTimestamp;
};
