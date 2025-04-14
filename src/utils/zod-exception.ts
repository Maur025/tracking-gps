import { ZodError } from 'zod';
import commonException from './common-exception';

export const errorValidate = (
	error: ZodError,
	message: string = 'An error occurred during validation'
) => {
	throw commonException(`${message}: ${error.message}`);
};
