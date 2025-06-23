import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@maur025/core-logger', () => ({
	loggerError: vi.fn(),
}));

import SwaggerRegisterPath from '@src/docs/swagger/swagger-register-path';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { loggerError } from '@maur025/core-logger';
import { SwaggerRegisterPathSchema } from '@src/docs/swagger/swagger-register-path.schema';

describe('swagger register path test', () => {
	let mockRegister: OpenAPIRegistry;
	const mockRegisterPath = vi.fn();

	beforeAll(() => {
		const MockOpenApiRegistry = vi.fn();
		MockOpenApiRegistry.prototype.registerPath = mockRegisterPath;

		mockRegister = new MockOpenApiRegistry();
	});

	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('build should return a new instance', () => {
		const newInstance = SwaggerRegisterPath.builder();

		expect(newInstance).toBeDefined();
		expect(newInstance).toBeInstanceOf(SwaggerRegisterPath);
	});

	test('should register a new path', () => {
		SwaggerRegisterPath.builder()
			.withRegister(mockRegister)
			.withRequest({ method: 'get', path: 'test', tags: [] })
			.register();

		expect(loggerError).not.toHaveBeenCalled();
		expect(mockRegisterPath).toHaveBeenCalledWith(
			expect.objectContaining({ method: 'get', path: 'test', tags: [] }),
		);
	});

	test('should throw when request is invalid', () => {
		const testError = () =>
			SwaggerRegisterPath.builder().withRequest(
				{} as SwaggerRegisterPathSchema,
			);

		expect(testError).toThrow();

		expect(loggerError).toHaveBeenCalledWith(
			`Error found in 'withRequest', invalid schema`,
		);
		expect(mockRegisterPath).not.toHaveBeenCalled();
	});

	test('should throw when swaggerRegister not exist', () => {
		const testError = () =>
			SwaggerRegisterPath.builder()
				.withRequest({
					method: 'get',
					path: 'test',
					tags: [],
				})
				.register();

		expect(testError).toThrow();

		expect(loggerError).toHaveBeenCalledWith(
			`swagger register or schema data must not be null`,
		);

		expect(mockRegisterPath).not.toHaveBeenCalled();
	});
});
