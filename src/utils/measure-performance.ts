import { loggerInfo } from '@maur025/core-logger';

export const measurePerformance = async (
	fn: () => unknown,
	message: string = '[system] process execute in:',
) => {
	const startTime: number = performance.now();
	await fn();
	const endTime: number = performance.now();

	const durationMs: number = endTime - startTime;
	const durationSec: string = (durationMs / 1000).toFixed(3);

	loggerInfo(`${message} ${durationSec}s`);
};
