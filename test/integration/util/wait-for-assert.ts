export const waitForAssert = async (
	assertFn: () => void | Promise<void>,
	intervalMs: number = 1000,
	triedNumber: number = 10,
): Promise<void> => {
	const isSuccessFull: boolean = false;
	let lastError: unknown;

	while (!isSuccessFull && triedNumber > 0) {
		try {
			await assertFn();

			return;
		} catch (error) {
			if (!(error instanceof Error)) {
				throw error;
			}

			if (error.name !== 'AssertionError') {
				throw error;
			}

			console.log(error.message);

			if (!error.message.includes('expected')) {
				console.log("ENTRO AQUI POR QUE MESSSAGE NO INCLUYE 'to be called'");

				throw error;
			}

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
