import { loggerError } from '@maur025/core-logger';
import { RequestValidate } from '@app/test-app/middlewares/request-validate.interface';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { flattenError, prettifyError, z } from 'zod/v4';

export const zodValidator =
	<T>(
		schema: z.ZodSchema<T>,
		dataToValidate: 'body' | 'query' | 'params' = 'body',
	) =>
	(req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse({ ...req[dataToValidate] });

		if (result.success) {
			switch (dataToValidate) {
				case 'body': {
					const newReq: RequestValidate<unknown, T> = req;
					newReq.bodyValidate = result.data;

					break;
				}
				case 'query': {
					const newReq: RequestValidate<T> = req;
					newReq.queryValidate = result.data;

					break;
				}
				case 'params': {
					const newReq: RequestValidate<unknown, unknown, T> = req;
					newReq.queryValidate = result.data;

					break;
				}
			}

			next();

			return;
		}

		const messageError = flattenError(result.error);
		const loggerMessage = prettifyError(result.error);

		loggerError(`zod validation error: '\n${loggerMessage}'`);

		res.status(StatusCodes.BAD_REQUEST).json({
			code: StatusCodes.BAD_REQUEST,
			message: 'BAD REQUEST',
			detail: messageError.fieldErrors,
		});
	};
