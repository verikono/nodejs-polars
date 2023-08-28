import { run, describe, test, it } from 'node:test';
import { tap } from 'node:test/reporters';
import { expect } from 'expect';
import { Transform } from 'node:stream';
import { reporter, pretty } from 'esm-vitest-runner';

const files = [
    new URL('./polars/index.mts', import.meta.url),
    new URL('./polars/datatype/index.mts', import.meta.url),
    new URL('./polars/datatype/types/index.mts', import.meta.url),
    new URL('./polars/datatype/types/Bool.mts', import.meta.url),
    new URL('./polars/datatype/PLRDataType.mts', import.meta.url)
].map(u => u.pathname);

console.log(`files:`);
files.forEach(pth => console.log(`\t - ${pth}`));

try {
    const runner = run({
        files,
        concurrency: false,
    }).compose(tap).pipe(process.stdout);
}
catch( err ) {
    console.log('>>>>');
}
