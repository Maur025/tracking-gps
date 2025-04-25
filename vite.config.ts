import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
	test: {
		globals: false,
		environment: 'node',
		setupFiles: './test/vitest.setup.ts',
	},
	resolve: {
		alias: {
			'@models': path.resolve(__dirname, 'src/models'),
			'@controllers': path.resolve(__dirname, 'src/controllers'),
			'@services': path.resolve(__dirname, 'src/services'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@middlewares': path.resolve(__dirname, 'src/middlewares'),
			'@config': path.resolve(__dirname, 'src/config'),
			'@routes': path.resolve(__dirname, 'src/routes'),
			'@socket': path.resolve(__dirname, 'src/socket'),
			'@cache': path.resolve(__dirname, 'src/cache'),
			'@command': path.resolve(__dirname, 'src/command'),
		},
	},
});
