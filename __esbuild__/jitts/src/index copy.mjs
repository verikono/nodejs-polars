import { transformSync } from 'esbuild';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { parse as pathParse } from 'node:path';

// import { before, beforeEach, describe, test, it } from 'node:test';
// import { expect } from 'expect';
import { appendFileSync } from 'node:fs';

const isBuiltInSpecifier = /^node:.*/;
const isTypescriptSpecifier = /^.*\.mts/;
const isJavascriptSpecifier = /^.*\.mjs/;
const isFileSpecifier = /^file:\/\//;
const isExportsSpecifier = /^nodejs-polars/;

const resolved = new Map();
resolved.set('nodejs-polars', { url: 'file:///home/bren/devel/nodejs-polars/polars/index.mts' });

resolved.set('nodejs-polars/datatype||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/index.mts' });
resolved.set('nodejs-polars/datatype/index.mjs||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/index.mts' });
resolved.set('nodejs-polars/datatype/PLRDataType.mts||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/PLRDataType.mts' });

resolved.set('nodejs-polars/datatype/types||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/types/index.mts' });
resolved.set('nodejs-polars/datatype/types/index.mjs||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/types/index.mts' });
resolved.set('nodejs-polars/datatype/types/Bool.mjs||', { url: 'file:///home/bren/devel/nodejs-polars/polars/datatype/types/Bool.mts' });

resolved.set('nodejs-polars', { url: 'file:///home/bren/devel/nodejs-polars/polars/index.mts' });



const compilations = new Map();




function isRepoSpecifier( spec, base = undefined ) {
    return spec.startsWith('file://') | spec.startsWith()
}

function getAssetKey( spec, base = undefined ) {
    return base === undefined ? spec : `${spec}||${base}`;
}

// function getAlternativeSuffixes( filePath )


function findSourceLocation( url ) {
    const candidates = [];
    if(existsSync(url.pathname)) candidates.push(url.pathname);
    for(let cand of candidates) {
        const { ext } = pathParse(cand);
        if(!ext) cand = cand.endsWith('/') ? `${cand}index.mts` : `${cand}/index.mts`;
        console.log(`TRYING ----> ${cand}`);
        for(const ex of [ ext, ext === 'mts' ? 'mjs' : 'mts' ]) {
     
            if(existsSync(cand)) {
                if(statSync(cand).isFile()) {
                    if(isJavascriptSpecifier.test(cand)) {
                        const content = readFileSync(cand, { encoding: 'utf8' });
                        resolved.set(getAssetKey(spec, context.parentURL), { content)
                        console.log(`\n\nCANDIDATE\n\n\n');
                    }
                }

            }
        }
    }
}

async function resolveFromCache( spec, base = undefined ) {

    const key = getAssetKey(spec,base);

    if(resolved.has(key)) {
        const record = resolved.get(key);
        return { format: 'module', url: record.url, shortCircuit: true };
    }




    let url;
    try { url = new URL(spec, base); }
    catch( err ) {
        console.log('\n\n\n');
        console.error(err);
        process.exit();
    }

    // resolve the URL to a path we know exists, and is a file.
    const sourcePath = await findSourceLocation(url);

    // console.log(`CACHE_FIND ${url.href} CHECK ON ${resolved.size} entries`);
    // if(resolved.has(url.href)) {
    // }

    // if(existsSync(url.pathname)) {
    //     const stat = statSync(url.pathnmame);
    //     if(stat.isFile()) {
    //         if(isTypescriptSpecifier.test(url.pathnaame)) {
    //             const result = transformSync(url.pathname, { format: 'esm', loader: 'ts' });
    //             resolved.set(url.href, {  })
    //         }
    //     }
    // }
}

// function getCompilation( url ) {
//     // const { ext } = pathParse(url.pathname);
//     if( existsSync(url.pathname) ) {
//         const stat = statSync(url.pathname);
//         if(stat.isFile()) {
//             const contents = readFileSync(url.pathname, { encoding: 'utf8' });
//         }
//     }
// }


export async function resolve( spec, context, nextResolve ) {

    console.log("RESOLVE", spec, context.parentURL);
    const cachedResolution = await resolveFromCache( spec, context.parentURL );
    // if(cachedResolution) return cachedResolution;
    // process.exit();
    // console.log("CACHEFAIL", spec, context.parentURL);
    // if(isTypescriptSpecifier(spec))


    // if(resolved.has(spec)) {
    //     console.debug(`RESOLVED_FROM_CACHE [${spec}]`)
    //     process.exit();
    //     return { format: 'module', url: resolved.get(spec).url, shortCircuit: true };
    // }


    // const { parentURL } = context;

    // const cached = resolved.get(specifier);



    // if(cached) {
    //     console.log('SPEC_FROM_CACHE', cached);
    //     process.exit('DINGA');
    //     return cached;
    // }
    // if(baseMap[specifier]) {
    //     resolved.set(specifier, baseMap[specifier]);
    //     return { format: 'module', url: baseMap[specifier], shortCircuit: true };
    // }
    // if(specifier.startsWith('file:///') || specifier.startsWith('./')) {

    //     const { parentURL = undefined } = context;
    //     let url = new URL(specifier, parentURL);
    //     if( parentURL && specifier.startsWith('node-js/polars')) {
    //         url = new URL( )
    //     }        
    //     if(!resolved.has(url.href) ) {
    //         if(!existsSync(url.pathname)) {
    //             url = new URL(url.href.replace(/\.mjs/, '.mts'));
    //             if(!existsSync(url.pathname)) {
    //                 if(specifier === 'nodejs-polars/datatype/types') {
    //                     url = new URL('file:///home/bren/devel/nodejs-polars/polars/datatype/types/index.mts');
    //                 }
    //                 else if(specifier === 'nodejs-polars/datatype') {
    //                     url = new URL('file:///home/bren/devel/nodejs-polars/polars/datatype/index.mts');
    //                 }
    //                 else {
    //                     throw new Error([
    //                         '-------',
    //                         `unresolveable file`,
    //                         `spec: ${specifier}`,
    //                         `path: ${url.pathname}`,
    //                         `href: ${url.href}`,
    //                         `base: ${parentURL||'none'}`,
    //                         `attempted: ${url.href}`,
    //                         '-------'
    //                     ].join('\n'));
    //                 }
    //             }
                
    //         }
    //         // resolved.set(url.href, { url: url.href, implicit: true });
    //         appendFileSync('__here.txt', [ url.href ].join('\n') + '\n');
    //         return {
    //             format: 'module',
    //             url: url.href,
    //             // importAssertions: {
    //             //     implicit: true
    //             // },
    //             shortCircuit: true,
    //         };
    //     }
    //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', specifier, context);
    // }

    return nextResolve(spec, context);

}

export function load( spec, context, nextLoad ) {
    console.log("LOAD", spec);
    const key = getAssetKey(spec, context);
    if(resolved.has(key)) {
        console.log('FOUND>>', key);
    }

    // console.log('LOAD >>', spec, context.parentURL);
    // if( spec.startsWith('file:')) {
    //     const filePath = new URL(spec).pathname;
       
   //     if(!existsSync(filePath)) {
    //         console.log("FAILLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", filePath);
    //     } else {
    //         console.debug(`confirmed | ${filePath}`)
    //     }
    // }
    // if(isTypescriptSpecifier.test(spec)) {

    //     const { implicit } = context.importAssertions;
    //     const url = new URL(spec);
    //     const content = readFileSync(url.pathname, { encoding: 'utf8' });

    //     const prefixCode = implicit ? [
    //         `import { before as beforeAll, beforeEach, describe, test, it } from 'node:test';`,
    //         `import { expect } from 'expect';`,
    //         `import.meta.vitest = { beforeAll, beforeEach, describe, test, it, expect };`,
    //         ``,
    //         ``
    //     ].join('\n') : [ "import.meta.vitest = undefined;" ];
    //     console.log(`COMPILING | ${url.pathname}`);
    //     let result;
    //     try {
    //         result = transformSync([ prefixCode, content ].join('\n'), { loader: 'ts' });
    //     }
    //     catch( err ) {
    //         console.log('FAILED!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    //     }
    //     console.log(`COMPILED | ${url.pathname}`);
    //     const source = result.code;
    //     // appendFileSync('__here.txt', [ spec, source ].join('\n') + '\n');

    //     return { format: 'module', source, shortCircuit: true };

    // }

    return nextLoad(spec, context);
    
}

