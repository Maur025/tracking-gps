export const getMinutesOfTimestamp = (timestamp: number = 0): number => {
	if (!timestamp) {
		return 0;
	}

	const totalSeconds = Math.floor(timestamp / 1000);

	return Math.floor((totalSeconds % 3600) / 60);
};
