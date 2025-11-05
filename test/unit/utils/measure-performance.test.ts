import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
vi.mock('@maur025/core-logger', () => ({
	loggerInfo: vi.fn(),
}));

import { loggerInfo } from '@maur025/core-logger';
import { measurePerformance } from '@utils/measure-performance.js';

describe('Measure performance test', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllTimers();
		vi.clearAllMocks();
	});

	test('should wait 1sec and return as message', async () => {
		const asyncFuncTest = () =>
			new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, 1000);
			});

		vi.spyOn(performance, 'now')
			.mockImplementationOnce(() => 0)
			.mockImplementationOnce(() => 1000);

		const promise = measurePerformance(
			asyncFuncTest,
			'[TEST] test measure performance execute in:',
		);

		vi.advanceTimersByTime(1000);
		await vi.runAllTicks();
		await vi.runAllTimers();

		await promise;

		expect(loggerInfo).toHaveBeenCalledWith(
			`[TEST] test measure performance execute in: 1.000s`,
		);
	});
});
