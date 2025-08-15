export const getRuleFrequencyInDay = (frequency: string | number): number => {
	const frequencyToUse: number =
		typeof frequency === 'string' ? Number(frequency) : frequency;

	if (frequencyToUse > 7) {
		throw new Error(
			'[RULE] (getRuleFrequencyInDay) weekly frequency is invalid',
		);
	}

	if (frequencyToUse === 7) {
		return 0;
	}

	return frequencyToUse;
};
