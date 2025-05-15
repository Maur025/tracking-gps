import { loggerError } from '@maur025/core-logger';

export const socketErrors = (error: Error): void => {
	loggerError(`Error has occurred with cause: `, error);
};
