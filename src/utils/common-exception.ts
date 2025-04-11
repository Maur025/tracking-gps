const commonException = (message: string): Error => {
	const stack: string | undefined = new Error().stack;

	if (!stack) {
		throw new Error(`[Stack trace is not available] ${message}`);
	}

	const stackLines: string[] = stack.split('\n');
	const callerLine: string = stackLines[2];

	const regex = /at (?:(\w+)\.)?(\w+)/;
	const match = regex.exec(callerLine);

	const className: string = match?.[1] ?? 'GlobalOrAnonymous';
	const methodName: string = match?.[2] ?? 'UnknownMethod';

	return new Error(`[class: ${className}] [method: ${methodName}] ${message}`);
};

export default commonException;
