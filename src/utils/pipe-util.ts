export const pipe = <T>(
	value: T,
	...functions: Array<(input: any) => any>
): any => {
	return functions.reduce((accumulator, func) => func(accumulator), value);
};
