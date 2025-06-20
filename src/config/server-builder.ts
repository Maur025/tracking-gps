import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import IServerBuilder from '@models/interface/server-builder.interface';
import express, { Application, Router } from 'express';
import { Server } from 'http';
import cors from 'cors';
import compression from 'compression';
import DEFAULT_LIMITS from './default-server-limits';
import { container, inject, injectable } from 'tsyringe';
import { TOKENS } from './ioc/token';
import {
	ServerBuilderRequest,
	ServerBuilderSchema,
} from '@models/schemas/server-builder-schema';
import { errorValidate } from '@utils/zod-exception';
@injectable()
export default class ServerBuilder implements IServerBuilder {
	private request?: ServerBuilderRequest;

	constructor(@inject(TOKENS.Application) private readonly app: Application) {}

	public static builder(): ServerBuilder {
		return container.resolve(ServerBuilder);
	}

	public withRequest(request: ServerBuilderRequest): this {
		this.request = { ...request };

		return this;
	}

	public applyMiddlewares(): this {
		this.app?.use(compression());
		this.setCors();
		this.app?.use(express.json({ limit: DEFAULT_LIMITS.LIMIT_JSON }));
		this.app?.use(express.text({ limit: DEFAULT_LIMITS.LIMIT_TEXT }));
		this.setUrlencoded();

		return this;
	}

	private readonly setCors = (): void => {
		this.app?.use(
			cors({
				origin: '*',
				optionsSuccessStatus: 200,
			}),
		);
	};

	private readonly setUrlencoded = (): void => {
		this.app?.use(
			express.urlencoded({
				extended: true,
				parameterLimit: DEFAULT_LIMITS.LIMIT_PARAMETER,
				limit: DEFAULT_LIMITS.LIMIT_URLENCODED,
			}),
		);
	};

	public applyRoutes(router: Router): this {
		this.app?.use('/api', router);
		return this;
	}

	public configureStatic(): this {
		const { staticPath } = this.request ?? {};
		this.app?.use('/', express.static(staticPath ?? 'public'));

		return this;
	}

	public build(): ServerBuilderResponse {
		this.validate();

		return { getApp: () => this.app, start: () => this.start() };
	}

	public start(): Server {
		const { host, port } = this.request ?? {};

		if (!host) {
			return this.app?.listen(port, () => this.getMessageSuccess());
		}

		return this.app?.listen(port!, host, () => this.getMessageSuccess());
	}

	private readonly validate = () => {
		const result = ServerBuilderSchema.safeParse({
			...this.request,
			app: this.app,
		});

		if (!result.success) {
			errorValidate(
				result.error,
				'Any property no set. Please set before starting server',
			);
		}
	};

	private readonly getMessageSuccess = (): void => {
		const { host, port } = this.request ?? {};

		console.info(`Server running on ${host ?? 'localhost'}:${port}`);
	};
}
