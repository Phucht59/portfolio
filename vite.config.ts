/// <reference types="vitest/config" />
import { defineConfig, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const archivePaths = ["test", "review"].map(
  (folder) => `${normalizePath(path.resolve(__dirname, folder))}/**`,
);

export default defineConfig({
  plugins: [react()],
  server: {
    fs: { deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", ...archivePaths] },
    watch: { ignored: archivePaths },
  },
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter(
          (dep) => !dep.includes("three") && !dep.includes("ribbon"),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("@react-three"))
              return "ribbon3d";
            if (id.includes("motion")) return "motion";
            if (id.includes("i18next") || id.includes("react-i18next"))
              return "i18n";
            if (id.includes("react-router")) return "router";
            if (id.includes("lucide-react")) return "icons";
          }
        },
      },
    },
  },
});
