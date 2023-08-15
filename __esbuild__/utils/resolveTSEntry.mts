import * as fsp from 'node:fs/promises';
import * as fs from 'node:fs';

import {
    type FSPath,
    type URLSpec,
    existsSync,
    isAbsFSPath,
    isFSPath,
    isFSURLSpec,
    isURLSpec,
    isRelFSPath,
    matchSync,
    raise,
    allExtensions,
    tsExtensionMap,
} from '../utils/index.mjs';


export declare type ResolveTSEntryParams = {

};



/**
 * 
 * @param {FSPath|URLSpec|URL} 
 * @param base 
 */
export function resolveTSEntry(
    entry: FSPath|URLSpec|URL,
    base: URLSpec|URL = `file://${process.cwd()}`,
): URL {

    const result = matchSync<URL>([
        () => entry instanceof URL ? entry : undefined,
        () => isFSURLSpec(entry) ? new URL(entry) : undefined,
        () => isAbsFSPath(entry) ? new URL(`file://${entry}`) : undefined,
        () => isRelFSPath(entry) ? new URL(entry, base instanceof URL ? base : new URL(base)) : undefined
    ]);

    if( result instanceof URL ) {

        if( existsSync(result) ) {

            const stat = fs.statSync(result.pathname);
            if( stat.isFile() ) return result;
            
        }

        const candidates = [''].concat(allExtensions).map(v => v ? `index${v}` : v );
        
        // for( const extEntry of candidates ) {
    
        //     try {
        //         const candidate = path.join(importPath, extEntry);
        //         if( fs.statSync(candidate).isFile() )
        //             return pathToFileURL(candidate).href;
        //     }
        //     catch( err ) {
        //         if( err instanceof Error && 'code' in err && err.code === 'ENOENT' ) continue;
        //         throw err; 
        //     }
        // }

        return result;

    }
    throw new Error(`resolveTSEntry: entry was invalid:\nentry: ${entry}\nbase: ${base}`);
}





if( import.meta.vitest ) {

    const {
        describe,
        test,
        expect
    } = import.meta.vitest;

    describe(`resolveTSEntry`, () => {

        test.each([
            [ import.meta.url, undefined, new URL(import.meta.url) ]
        ])( `( test %# ): %s`, ( entry, base, expected ) => {
            expect(resolveTSEntry(entry, base).href).toBe(expected.href) 
        });

    });

    // describe.todo(`RelFSPathRx`);

    // describe.todo(`AbsFSPathRx`);

}
