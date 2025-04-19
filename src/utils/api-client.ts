import { fromFetch } from 'rxjs/fetch';
import { getAgentByUrl } from '../config/dns-cache';
import {
	catchError,
	from,
	Observable,
	switchMap,
	throwError,
	timeout,
} from 'rxjs';
import { HttpMethod } from '@models/types/http-method.type';
import { ApiException } from './api-exception';

const options: RequestInit = {
	headers: { 'content-type': 'application/json' },
};

const request = <T>(
	url: string,
	method: HttpMethod,
	body?: unknown,
	headers: Record<string, string> = {}
): Observable<T> => {
	const allOptions = {
		...options,
		headers: { ...options.headers, ...headers },
		method,
		agent: getAgentByUrl(url),
		body: body ? JSON.stringify(body) : undefined,
	};

	return fromFetch(url, allOptions).pipe(
		timeout({
			each: 120000,
			with: () => throwError(() => new ApiException(408, 'Connection Timeout')),
		}),
		switchMap(response => {
			if (!response.ok) {
				return from(
					response.json()?.then((errorBody: any) => {
						throw new ApiException(
							response.status,
							errorBody.message ?? 'Error desconocido'
						);
					})
				);
			}

			return from(response.json() as Promise<T>);
		}),
		catchError(error => throwError(() => error))
	);
};

export const get = <T>(
	url: string,
	headers: Record<string, string> = {}
): Observable<T> => request<T>(url, 'GET', undefined, headers);

export const post = <T>(
	url: string,
	body: any,
	headers: Record<string, string> = {}
): Observable<T> => request<T>(url, 'POST', body, headers);

export const put = <T>(
	url: string,
	body: any,
	headers: Record<string, string> = {}
): Observable<T> => request<T>(url, 'PUT', body, headers);

export const delet = <T>(
	url: string,
	headers: Record<string, string> = {}
): Observable<T> => request<T>(url, 'DELETE', undefined, headers);

export const patch = <T>(
	url: string,
	body: any,
	headers: Record<string, string> = {}
): Observable<T> => request<T>(url, 'PATCH', body, headers);
