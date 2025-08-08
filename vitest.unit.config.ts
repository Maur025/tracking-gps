import viteConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ['test/unit/**/*.test.ts', '**/*.unit.test.ts'],
			setupFiles: ['./test/unit/vitest.setup.ts'],
		},
	}),
);
