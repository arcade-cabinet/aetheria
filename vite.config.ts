import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { vitePlugins } from "./vite/plugin";

function pathResolve(dir: string) {
	return resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
	const root = process.cwd();
	const env = loadEnv(mode, root);
	return defineConfig({
		base: env.VITE_PUBLIC_PATH,
		root,
		// plugin
		plugins: [react(), tailwindcss(), ...vitePlugins(env)],
		assetsInclude: ["**/*.wasm"], // Ensure WASM is treated as an asset
		// alias
		resolve: {
			alias: {
				"@": pathResolve("src"),
			},
			// https://github.com/vitejs/vite/issues/178#issuecomment-630138450
			extensions: [".js", ".ts", ".json", ".tsx"],
		},
		// https://vitejs.cn/config/#esbuild
		esbuild: {
			// pure: env.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
			pure: mode === "production" ? ["console.log"] : [],
			//  drop: ["console", "debugger"],
		},
		// server config
		server: {
			// host: '192.168.0.0',
			port: 8088,
			open: true, // auto open
			hmr: true,
			cors: true,
			headers: {
				"Cross-Origin-Opener-Policy": "same-origin",
				"Cross-Origin-Embedder-Policy": "require-corp",
			},
		},

		// build: https://vitejs.cn/config/#build-target
		build: {
			target: "modules",
			outDir: "dist",
			chunkSizeWarningLimit: 550,
			assetsInlineLimit: 4096,
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["react", "react-dom"],
						babylon: [
							"@babylonjs/core",
							"@babylonjs/loaders",
							"@babylonjs/havok",
							"@babylonjs/gui",
						],
						ecs: ["miniplex"],
					},
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
				},
			},
		},

		optimizeDeps: {
			exclude: ["@babylonjs/havok"],
		},
	});
};
