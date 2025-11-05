import {
	beforeAll,
	beforeEach,
	describe,
	expect,
	Mock,
	test,
	vi,
} from 'vitest';

vi.mock('@src/docs/load-all-swagger-docs', () => ({
	loadAllSwaggerDocs: vi.fn(),
}));

vi.mock('swagger-ui-express', () => ({
	__esModule: true,
	default: {
		serve: vi.fn(),
		setup: vi.fn(() => ({})),
	},
}));

import { loadAllSwaggerDocs } from '@src/docs/load-all-swagger-docs.js';
import { swaggerConfig } from '@config/swagger-config.js';
import type { Application } from 'express';
import swaggerUiExpress from 'swagger-ui-express';

describe('swagger config test', () => {
	let mockApp: Application;
	const mockUseApp: Mock = vi.fn();

	beforeAll(() => {
		const MockApp = vi.fn();
		MockApp.prototype.use = mockUseApp;

		mockApp = new MockApp();
	});

	beforeEach(() => {
		vi.resetAllMocks();
	});

	test('should do swagger config', () => {
		swaggerConfig(mockApp);

		expect(loadAllSwaggerDocs).toHaveBeenCalledOnce();

		expect(swaggerUiExpress.setup).toHaveBeenCalledOnce();

		expect(mockUseApp).toHaveBeenCalledWith(
			'/docs',
			swaggerUiExpress.serve,
			expect.any(Object),
		);
	});
});
