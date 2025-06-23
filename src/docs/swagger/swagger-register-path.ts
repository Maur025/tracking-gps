import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { SwaggerRegisterPathSchema } from './swagger-register-path.schema';
import { loggerError } from '@maur025/core-logger';

export default class SwaggerRegisterPath {
	private swaggerRegister?: OpenAPIRegistry;
	private schemaData?: RouteConfig;

	public static builder(): SwaggerRegisterPath {
		return new SwaggerRegisterPath();
	}

	public withRegister(swaggerRegister: OpenAPIRegistry): this {
		this.swaggerRegister = swaggerRegister;
		return this;
	}

	public withRequest(request: SwaggerRegisterPathSchema): this {
		const result = SwaggerRegisterPathSchema.safeParse(request);

		if (!result.success) {
			loggerError(`Error found in 'withRequest', invalid schema`);
			throw new Error('Error in withRequest', result.error);
		}

		this.schemaData = result.data as RouteConfig;

		return this;
	}

	public register(): void {
		if (!this.swaggerRegister || !this.schemaData) {
			loggerError(`swagger register or schema data must not be null`);
			throw new Error(`An error occurred in register`);
		}

		this.swaggerRegister.registerPath(this.schemaData);
	}
}
