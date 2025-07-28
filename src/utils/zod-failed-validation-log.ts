import { loggerError } from '@maur025/core-logger';
import { prettifyError, ZodError } from 'zod/v4';

export const zodFailedValidationLog = <T>({
	error,
	message = 'schema in object or function validation failure:',
}: {
	error: ZodError<T>;
	message: string;
}) => {
	loggerError(`${message} '\n${prettifyError(error)}'`);
};
