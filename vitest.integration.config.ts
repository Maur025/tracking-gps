import viteConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ['test/integration/**/*.test.ts', '**/*.integration.test.ts'],
		},
	}),
);
