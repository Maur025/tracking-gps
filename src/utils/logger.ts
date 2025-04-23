import { container } from 'tsyringe';
import LoggerWinston from './logger-winston';

const loggerWinston = container.resolve(LoggerWinston);
const logger = loggerWinston.getLogger();

export const loggerInfo = (message: string): void => {
	logger.info(message);
};

export const loggerWarn = (message: string) => {
	logger.warn(message);
};

export const loggerError = (message: string, error?: Error) => {
	logger.error(message, error);
};

export const loggerDebug = (message: string) => {
	logger.debug(message);
};

export const loggerHttp = (message: string) => {
	logger.http(message);
};

export const loggerVerbose = (message: string) => {
	logger.verbose(message);
};

export const loggerSilly = (message: string) => {
	logger.silly(message);
};
