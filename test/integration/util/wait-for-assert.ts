import { loggerDebug } from '@maur025/core-logger';

export const waitForAssert = async (
	assertFn: () => void | Promise<void>,
	intervalMs: number = 1000,
	triedNumber: number = 15,
): Promise<void> => {
	const isSuccessFull: boolean = false;
	let lastError: unknown;

	while (!isSuccessFull && triedNumber > 0) {
		try {
			await assertFn();

			return;
		} catch (error) {
			if (!(error instanceof Error)) {
				loggerDebug(`Non-error caught in waitForAssert: ${error}`);
				throw error;
			}

			if (error.name !== 'AssertionError') {
				loggerDebug(
					`Non-assertion error caught in waitForAssert: ${error.message}`,
				);

				throw error;
			}

			if (!error.message.includes('expected')) {
				loggerDebug(
					`Non-assertion error caught in waitForAssert: ${error.message}`,
				);

				throw error;
			}

			lastError = error;

			loggerDebug(`Assertion error caught in waitForAssert: ${lastError}`);
			await new Promise(resolve => setTimeout(resolve, intervalMs));
		}

		triedNumber--;
	}

	if (!isSuccessFull) {
		loggerDebug(
			`waitForAssert failed after all retries, throwing last error: ${lastError}`,
		);
		throw lastError;
	}
};
