/* eslint-disable @typescript-eslint/no-explicit-any */
import z, { any, object, record, string } from 'zod';
import { HttpMethodSchema } from './schema/http-method.schema.js';
import { getAgentByUrl } from '@config/dns-cache.js';
import { loggerError } from '@maur025/core-logger';

const FetchApiRequest = object({
	url: string(),
	method: HttpMethodSchema,
	body: any().optional(),
	headers: record(string(), string()).optional(),
});

type FetchApiRequest = z.infer<typeof FetchApiRequest>;

export const fetchApi = async <R>(request: FetchApiRequest): Promise<R> => {
	const { url, method, body, headers = {} } = FetchApiRequest.parse(request);

	const allOptions = {
		headers: {
			'content-type': 'application/json',
			...headers,
		},
		method,
		agent: getAgentByUrl(url),
		body: body ? JSON.stringify(body) : undefined,
	};

	const response = await fetch(url, allOptions);

	if (!response.ok) {
		let errorMessage = `Error ${response.status}`;

		try {
			const errorData = await response.clone().json();

			errorMessage = errorData?.message || JSON.stringify(errorData);
		} catch {
			const text = await response.clone().text();

			if (text) errorMessage = text;
		}

		loggerError(`[API CLIENT] (fetchApi) ${errorMessage}`);
		throw new Error(errorMessage);
	}

	return response.json();
};

export const get = async <R>(
	url: string,
	headers: Record<string, string> = {},
): Promise<R> => fetchApi<R>({ url, method: 'GET', headers });

export const post = async <R>(
	url: string,
	body: any,
	headers: Record<string, string> = {},
): Promise<R> => fetchApi<R>({ url, method: 'POST', body, headers });

export const put = async <R>(
	url: string,
	body: any,
	headers: Record<string, string> = {},
): Promise<R> => fetchApi<R>({ url, method: 'PUT', body, headers });

export const del = async <R>(
	url: string,
	headers: Record<string, string> = {},
): Promise<R> => fetchApi<R>({ url, method: 'DELETE', headers });

export const patch = async <R>(
	url: string,
	body: any,
	headers: Record<string, string> = {},
): Promise<R> => fetchApi<R>({ url, method: 'PATCH', body, headers });
