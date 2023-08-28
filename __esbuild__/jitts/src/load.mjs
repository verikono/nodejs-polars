import { routes } from './index.mjs';
import { transformSync } from 'esbuild';
import { existsSync, readFileSync } from 'node:fs';
import { parse as pathParse } from 'node:path';

const prefix = [
    `import { before as beforeAll, beforeEach, describe, test, it } from 'node:test';`,
    `import { expect } from 'expect';`,
    `import.meta.vitest = { beforeAll, beforeEach, describe, test, it, expect };`,
    ``,
    ``
].join('\n');


export function load( url, context, next ) {

    const {
        parentURL = undefined,
        importAssertions: {
            compile,
            module
        }
    } = context;



    if(compile) {
        const { pathname } = new URL(url);
        if(existsSync(pathname)) {
            try {
                const content = readFileSync(pathname, { encoding: 'utf-8' });
                const result = transformSync(content, { loader: 'ts' });
                const { code } = result;
                const source = [ prefix, code ].join('\n');
                return { format: 'module', source, shortCircuit: true };
            }
            catch( err ) {
                console.error(`failed compilation step for ${url.href}`);
                process.exit();
            }
        }
        console.error(`JITTS.load --- file not exists ${pathname}`);
        process.exit();
    }

    if( parentURL !== undefined) {
        console.log('-=-0---');
    }

    const fileURL = new URL(url);
    const { pathname } = fileURL;
    const { ext } = pathParse(pathname);

    if( ext === '.mts' ) {
        try {
            const content = readFileSync(pathname, { encoding: 'utf-8' });
            const result = transformSync(content, { loader: 'ts' });
            const { code } = result;
            const source = [ prefix, code ].join('\n');
            return { format: 'module', source, shortCircuit: true };
        }
        catch( err ) {
            console.error(`failed compilation step for ${url.href}`);
            process.exit();
        }
    }
    return next(url, context);
}
