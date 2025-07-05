import { Application } from 'express';
import { z } from 'zod';

export interface ServerBuilderRequest {
	app?: Application;
	host?: string;
	port?: number;
	staticPath?: string;
}

export const ServerBuilderSchema = z.object({
	host: z.string().nullable().optional(),
	port: z.number().int().min(1).max(65535),
	staticPath: z.string().nullable().optional(),
	app: z.custom<Application>(
		val => typeof val === 'function' || typeof val === 'object',
	),
});
