import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(),
	loggerDebug: vi.fn(),
	loggerInfo: vi.fn(),
	loggerSilly: vi.fn(),
	loggerWarn: vi.fn(),
}));

import {
	loggerError,
	loggerDebug,
	loggerInfo,
	loggerSilly,
	loggerWarn,
} from '@maur025/core-logger';
import { kafkaLogger } from '@utils/kafka/kafka-logger';
import { LogEntry, logLevel } from 'kafkajs';

describe('Kafka logger test', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should run loggerError when logLevel equal ERROR', () => {
		kafkaLogger({
			level: logLevel.ERROR,
			log: {
				message: "it's an error test",
			},
		} as LogEntry);

		expect(loggerError).toHaveBeenCalledWith(
			`[KAFKA] it's an error test`,
			undefined,
		);

		expect(loggerDebug).not.toHaveBeenCalled();
		expect(loggerInfo).not.toHaveBeenCalled();
		expect(loggerSilly).not.toHaveBeenCalled();
		expect(loggerWarn).not.toHaveBeenCalled();
	});

	test('should run loggerWarn when logLevel equal to WARN', () => {
		kafkaLogger({
			level: logLevel.WARN,
			log: {
				message: `it's a warn test`,
			},
		} as LogEntry);

		expect(loggerWarn).toHaveBeenCalledWith(`[KAFKA] it's a warn test`);

		expect(loggerError).not.toHaveBeenCalled();
		expect(loggerDebug).not.toHaveBeenCalled();
		expect(loggerInfo).not.toHaveBeenCalled();
		expect(loggerSilly).not.toHaveBeenCalled();
	});

	test('should run loggerInfo when logLevel is equal to INFO', () => {
		kafkaLogger({
			level: logLevel.INFO,
			log: { message: `it's an info test` },
		} as LogEntry);

		expect(loggerInfo).toHaveBeenCalledWith(`[KAFKA] it's an info test`);

		expect(loggerError).not.toHaveBeenCalled();
		expect(loggerDebug).not.toHaveBeenCalled();
		expect(loggerSilly).not.toHaveBeenCalled();
		expect(loggerWarn).not.toHaveBeenCalled();
	});

	test('should run loggerDebug when logLevel is equal to DEBUG', () => {
		kafkaLogger({
			level: logLevel.DEBUG,
			log: { message: `it's a debug test` },
		} as LogEntry);

		expect(loggerDebug).toHaveBeenCalledWith(`[KAFKA] it's a debug test`);

		expect(loggerError).not.toHaveBeenCalled();
		expect(loggerInfo).not.toHaveBeenCalled();
		expect(loggerSilly).not.toHaveBeenCalled();
		expect(loggerWarn).not.toHaveBeenCalled();
	});

	test('should run loggerSilly when logLevel not is in switch', () => {
		kafkaLogger({
			level: logLevel.NOTHING,
			log: { message: `it's an any test` },
		} as LogEntry);

		expect(loggerSilly).toHaveBeenCalledWith(`[KAFKA] it's an any test`);
	});
});
