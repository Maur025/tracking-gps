export const getWeeklyDay = (): number => {
	const nowDate: Date = new Date();

	return nowDate.getDay();
};
