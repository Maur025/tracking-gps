export const getObjectOfString = <T>(stringValue: string): T => {
	try {
		return JSON.parse(stringValue);
	} catch (error) {
		throw new Error(`Error founded to convert string to json`, error as Error);
	}
};
