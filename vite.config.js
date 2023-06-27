import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

import dns from "dns";
dns.setDefaultResultOrder("verbatim");

export default () => {
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
    base: "/",
  });
};
