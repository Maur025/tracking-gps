export const waitForAssert = async (
	assertFn: () => void | Promise<void>,
	intervalMs: number = 1000,
	triedNumber: number = 10,
): Promise<void> => {
	let isSuccessFull: boolean = false;
	let lastError: unknown;

	while (!isSuccessFull && triedNumber > 0) {
		try {
			await assertFn();
			isSuccessFull = true;
		} catch (error) {
			lastError = error;
			console.log(`Still waiting for assert, trying again...`);

			await new Promise(resolve => setTimeout(resolve, intervalMs));
		}

		triedNumber--;
	}

	if (!isSuccessFull) {
		throw lastError;
	}
};
