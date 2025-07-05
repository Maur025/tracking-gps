import {
	loggerDebug,
	loggerError,
	loggerInfo,
	loggerSilly,
	loggerWarn,
} from '@maur025/core-logger';
import { LogEntry, logLevel } from 'kafkajs';

export const kafkaLogger = ({ level, log }: LogEntry): void => {
	const message: string = `[KAFKA] ${log.message}`;

	switch (level) {
		case logLevel.ERROR: {
			loggerError(message, log.error);
			break;
		}
		case logLevel.WARN: {
			loggerWarn(message);
			break;
		}
		case logLevel.INFO: {
			loggerInfo(message);
			break;
		}
		case logLevel.DEBUG: {
			loggerDebug(message);
			break;
		}
		default: {
			loggerSilly(message);
		}
	}
};
