export const getTotalSecondsElapsedSincePreviousTimestamp = (
	currentTimestamp: number,
	previousTimestamp: number,
): number => {
	const timeDifference = currentTimestamp - previousTimestamp;
	return Math.floor(timeDifference / 1000);
};
