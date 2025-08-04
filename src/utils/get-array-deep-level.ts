export const getArrayDeepLevel = (
	possibleArray: unknown,
	count: number = 0,
): number => {
	if (!Array.isArray(possibleArray)) {
		return count;
	}

	return getArrayDeepLevel(possibleArray[0], count + 1);
};
