import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	server: {
		hmr: {
			clientPort: Number(process.env.PORT) + 1 || 3000 + 1,
			port: Number(process.env.PORT) + 1 || 3000 + 1,
		},
		port: Number(process.env.PORT) + 1 || 3000 + 1,
		proxy: {
			"/b": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/b/, ""),
				ws: true,
			},
		},
	},
});
