import { describe, expect, test, vi } from 'vitest';
vi.mock('@maur025/core-logger', () => ({
	loggerInfo: vi.fn(),
}));

import { loggerInfo } from '@maur025/core-logger';
import { measurePerformance } from '@utils/measure-performance';

describe('Measure performance test', () => {
	test('should wait 1sec and return as message', async () => {
		vi.useFakeTimers();

		const asyncFuncTest = () =>
			new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, 1000);
			});

		const promise = measurePerformance(
			asyncFuncTest,
			'[TEST] test measure performance execute in:',
		);

		vi.advanceTimersByTime(1000);
		await promise;

		expect(loggerInfo).toHaveBeenCalledWith(
			`[TEST] test measure performance execute in: 1.000s`,
		);

		vi.useRealTimers();
	});
});
