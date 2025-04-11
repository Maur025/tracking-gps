import ServerBuilderResponse from '@models/interface/server-builder-response.interface';
import IServerBuilder from '@models/interface/server-builder.interface';
import express, { Application, Router } from 'express';
import { Server } from 'http';
import cors from 'cors';
import compression from 'compression';
import DEFAULT_LIMITS from './default-server-limits';
import commonException from '@utils/common-exception';

export default class ServerBuilder implements IServerBuilder {
	private readonly app: Application;
	private host: string | null = null;
	private port: number | null = null;
	private staticPath: string | null = null;

	private constructor() {
		this.app = express();
	}

	public static builder(): ServerBuilder {
		return new ServerBuilder();
	}

	public setHost(host: string): this {
		this.host = host;
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
		if (!this.port) {
			throw commonException(
				'Port not set. Please set the port before building the server.'
			);
		}

		return { getApp: () => this.app, start: () => this.start() };
	}

	public start(): Server {
		if (!this.port) {
			throw commonException(
				'Port not set. Please set the port before starting the server.'
			);
		}

		if (!this.host) {
			return this.app?.listen(this.port, () => this.getMessageSuccess());
		}

		return this.app?.listen(this.port, this.host, () =>
			this.getMessageSuccess()
		);
	}

	private readonly getMessageSuccess = (): void => {
		console.info(`Server running on ${this.host ?? 'localhost'}:${this.port}`);
	};
}
