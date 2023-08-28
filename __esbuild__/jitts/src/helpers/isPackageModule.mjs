import { appendFileSync } from 'node:fs';
import { base } from '../index.mjs'

const inSourceDirectory = /^file:\/\/\/home\/bren\/devel\/nodejs-polars\/polars/;
const isRelativeSpec = /^\.\//;

export function isPackageModule( spec, context ) {
    const { parentURL = undefined } = context;
    if( /^nodejs-polars/.test(spec) ) return true;
    if( inSourceDirectory.test(spec) ) return true;
    if( isRelativeSpec.test(spec) && Boolean(parentURL) && inSourceDirectory.test(parentURL) ) return true;

    logRejections(spec, parentURL);
    return false;
}

function logRejections( spec, base ) {
    if( process.env.LOG_JITTS === "all" ) {
        try {
            const { pathname } = new URL(spec, base);
            base = base || "none";
            const outFilePath = new URL('../../___external_module_list.log', import.meta.url).pathname;
            appendFileSync(outFilePath, `\n${spec} | ${base} | ${pathname}`);
        }
        catch( err ) {
            console.log('\n\n\n');
            console.error(`failed building url from [ spec: ${spec} | base: ${base} ]\n${err.message}`);
            process.exit();
        }
    }
}
