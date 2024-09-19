import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		host: "0.0.0.0",
		hmr: {
			clientPort: Number(process.env.PORT) + 1 || 3000 + 1,
			port: Number(process.env.PORT) + 1 || 3000 + 1
		},
		port: Number(process.env.PORT) + 1 || 3000 + 1,
		proxy: {
			'/b': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				//rewrite: (path) => path.replace(/^\/b/, ''),
				ws: true
			}
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ["legacy-js-api"],
			},
		},
	}
});
