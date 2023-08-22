import { defineConfig } from 'vitest/config';

export default defineConfig({
    root: ".",
    test: {
        include: [
            "./polars"
        ],
        includeSource: [
            "./__esbuild__/utils/**/*"
        ],
        reporters: [ 'verbose' ]
    }
});

