import { defineConfig } from 'vitest/config';
import { describe } from 'vitest';

export default defineConfig({
    test: {
        include: [ "./__tests__/**/*.test.ts" ],
        globals: true,
        setupFiles: [
            "./__tests__/vitestSetup.ts"
        ],
        alias: {
            "@polars": "./polars/index.ts"
        }
    }
});
