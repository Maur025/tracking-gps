import { loggerError } from '@utils/logger';

export const socketErrors = (error: Error): void => {
	loggerError(`Error has occurred with cause: `, error);
};
