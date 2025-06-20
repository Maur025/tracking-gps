import { Request } from 'express';

export interface RequestValidate<Q = unknown, B = unknown, P = unknown>
	extends Request {
	queryValidate?: Q;
	bodyValidate?: B;
	paramsValidate?: P;
}
