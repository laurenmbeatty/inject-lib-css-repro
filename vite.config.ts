import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import preserveDirectives from "rollup-preserve-directives";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import packageJson from "./package.json";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
    libInjectCss(),
    preserveDirectives(),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "pretend-library",
      formats: ["es", "cjs"],
    },
    minify: false,
    commonjsOptions: {
      requireReturnsDefault: true,
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      input: Object.fromEntries(
        glob
          .sync("src/**/*.{ts,tsx}", {
            ignore: ["node_modules/**"],
          })
          .map((file) => {
            return [
              relative(
                "src",
                file.slice(0, file.length - extname(file).length)
              ),
              fileURLToPath(new URL(file, import.meta.url)),
            ];
          })
      ),
      output: {
        interop: "auto",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].[format].js",
      },
    },
  },
});
