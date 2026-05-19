const path = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  root: __dirname,
  plugins: [react()],
  build: {
    outDir: path.join(__dirname, "..", "dist"),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/uploads": "http://localhost:3000",
      "/assets": "http://localhost:3000"
    }
  }
});
