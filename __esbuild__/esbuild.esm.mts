import { build, type BuildOptions } from "esbuild";

const options: BuildOptions = {
  entryPoints: ["./polars/**/*.ts"],
  loader: { ".node": "file" },
  outdir: "./dist/esm",
  format: "esm",
  platform: "node",
  outExtension: { ".js": ".mjs" },
  tsconfig: "./tsconfig.buildesm.json",
};
