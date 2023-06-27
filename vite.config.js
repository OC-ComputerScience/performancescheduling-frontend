import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default () => {
  const baseURL = import.meta.env === "development" ? "/" : "/";

  return defineConfig({
    transpileDependencies: ["vuetify"],
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: { configFile: "src/settings.scss" },
      }),
    ],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
  });
};
