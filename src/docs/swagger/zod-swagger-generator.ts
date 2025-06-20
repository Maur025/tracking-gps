import { singleton } from 'tsyringe';
import {
	OpenApiGeneratorV3,
	OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { OpenAPIObject } from '@asteasolutions/zod-to-openapi/dist/types';

@singleton()
export default class ZodSwaggerGenerator {
	private readonly registry: OpenAPIRegistry = new OpenAPIRegistry();

	public getRegistry(): OpenAPIRegistry {
		return this.registry;
	}

	public getOpenApiDocument(): OpenAPIObject | unknown {
		const generator = new OpenApiGeneratorV3(this.registry.definitions);

		return generator.generateDocument({
			openapi: '3.0.0',
			info: {
				version: '1.0.0',
				title: 'My API',
				description: 'This is the API',
			},
			servers: [{ url: 'v1' }],
		});
	}
}
