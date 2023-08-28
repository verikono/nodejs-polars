import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
      includeSource: [
        "./polars/datatype/PLRDataType.mts",
        "./polars/datatype/types/*.mts",

      ],
      exclude: [
        "**/*.node",
        "**/node_modules/**",
        "**/@types/**/*",
        "**/*.ts",
        "./polars/datatype/types/_*.mts"
      ],
      reporters: [ 'verbose' ]
    }
});
