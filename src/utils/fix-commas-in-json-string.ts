export const fixCommasInJsonString = (strValue: string): string => {
	return strValue.replace(/,(\s*[\]}])/g, '$1');
};
