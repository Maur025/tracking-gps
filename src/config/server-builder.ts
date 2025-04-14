import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import IServerBuilder from '@models/interface/server-builder.interface';
import express, { Application, Router } from 'express';
import { Server } from 'http';
import cors from 'cors';
import compression from 'compression';
import DEFAULT_LIMITS from './default-server-limits';
import { container, inject, injectable } from 'tsyringe';
import { TOKENS } from './ioc/token';
import { ServerBuilderSchema } from '@models/schemas/server-builder-schema';
import { errorValidate } from '@utils/zod-exception';
@injectable()
export default class ServerBuilder implements IServerBuilder {
	private host: string | null = null;
	private port: number | null = null;
	private staticPath: string | null = null;

	constructor(@inject(TOKENS.Application) private readonly app: Application) {}

	public static builder(): ServerBuilder {
		return container.resolve(ServerBuilder);
	}

	public setHost(host: string | undefined): this {
		if (host) {
			this.host = host;
		}

		return this;
	}

	public setPort(port: number): this {
		this.port = port;
		return this;
	}

	public setStaticPath(staticPath: string): this {
		this.staticPath = staticPath;
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
			})
		);
	};

	private readonly setUrlencoded = (): void => {
		this.app?.use(
			express.urlencoded({
				extended: true,
				parameterLimit: DEFAULT_LIMITS.LIMIT_PARAMETER,
				limit: DEFAULT_LIMITS.LIMIT_URLENCODED,
			})
		);
	};

	public applyRoutes(router: Router): this {
		this.app?.use('/api', router);
		return this;
	}

	public configureStatic(): this {
		this.app?.use('/', express.static(this.staticPath ?? 'public'));

		return this;
	}

	public build(): ServerBuilderResponse {
		this.validate();

		return { getApp: () => this.app, start: () => this.start() };
	}

	public start(): Server {
		if (!this.host) {
			return this.app?.listen(this.port, () => this.getMessageSuccess());
		}

		return this.app?.listen(this.port!, this.host, () =>
			this.getMessageSuccess()
		);
	}

	private readonly validate = () => {
		const result = ServerBuilderSchema.safeParse({
			host: this.host,
			port: this.port,
			staticPath: this.staticPath,
			app: this.app,
		});

		if (!result.success) {
			errorValidate(
				result.error,
				'Any property no set. Please set before starting server'
			);
		}
	};

	private readonly getMessageSuccess = (): void => {
		console.info(`Server running on ${this.host ?? 'localhost'}:${this.port}`);
	};
}
