import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const content = req('./index.cjs');
export * from content;
