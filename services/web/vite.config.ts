import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      babel: (_: any, id: string) => ({
        plugins: [["solid-styled/babel", { source: id }]],
      }),
    }),
  ],
});
