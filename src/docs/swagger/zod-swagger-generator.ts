import { singleton } from 'tsyringe';
import {
	OpenApiGeneratorV31,
	OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { OpenAPIObject } from '@asteasolutions/zod-to-openapi/dist/types.js';
import environment from '@config/env.js';

@singleton()
export default class ZodSwaggerGenerator {
	private readonly registry: OpenAPIRegistry = new OpenAPIRegistry();
	private tags: object[] = [];

	public getRegistry(): OpenAPIRegistry {
		return this.registry;
	}

	public setTags(tags: object[]): void {
		this.tags = tags;
	}

	public getOpenApiDocument(): OpenAPIObject | unknown {
		const generator = new OpenApiGeneratorV31(this.registry.definitions);

		return generator.generateDocument({
			openapi: '3.1.0',
			info: {
				version: '1.0.0',
				title: 'Tracking GPS',
				description: 'API Docs with Swagger',
			},
			servers: [
				{
					url: `http://${environment.HOST ?? 'localhost'}:${environment.PORT}`,
				},
			],
			tags: this.tags as [],
		});
	}
}
