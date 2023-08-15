import * as path from 'node:path';
import * as fs from 'node:fs';

import {
    access,
    constants,
} from 'node:fs/promises';

import {
    pathToFileURL,
} from 'node:url';

import {
    type FSPath,
    type AbsFSPath,
    type RelFSPath,
    isAbsFSpath
} from './FSPath.mjs';

import {
    type URLSpec,
} from './utils/URLSpec.mjs';




type TypeGuardParams = {
    assert: boolean;
}

type TypeGuardOptions = Partial<TypeGuardParams>;

export const typeGuardDefaults:TypeGuardParams = {
    assert: false
};






export const translateExtMap: Record<JSExt, TSExt> = {
    '.mjs': '.mts',
    '.js': '.ts',
    '.cjs': '.cts',
    '.d.ts': '.d.ts'
};


export function assertFSPath( spec: FSPath|URLSpec|URL ): FSPath {
    return (
        spec instanceof URL
            ? spec.pathname
            : spec.replace(/(?:file:)/, '').replace(/\/\//, '')
    );
}


/** 
 * @description URLs and Paths have different navigation semantics, this converts 
 * relative paths to relative URL paths. 
 * 
 * for example: 
 * FS Paths will interpretes "../" to mean "the directory this file is in" 
 * URL Paths will interpret "./" to mean "the directory this file is in" and "../" to mean the "directory above the directory this file is in"
*/
export function relativePathToRelativeURLSpec( spec: FSPath ): URLSpec {
    const { ext } = path.parse(spec);
    return !!ext ? spec.replace(/^\.\. /, './') : spec;
}





/**
 * resolve an import specifier to an absolute URL Specifier.
 * 
 * @param entry 
 * @param {string|URL} a base 
 * @returns 
 */
export function resolveTSEntryToSpec( entry: string|URL, base?: string|URL ): string {

    entry = assertFSPath(entry) as string;
    base = base ? assertFSPath(base) as string : base;

    const importPath = base ? path.join(base, entry) : entry;

    // see if the importPath refers to an existing file and return it for this simple case.
    if( fs.existsSync(importPath) ) return `file://${importPath}`;

    const candidates = [''].concat(
        Object.values(translateExtMap),
        Object.keys(translateExtMap)
    ).map(v => v ? `index${v}` : v );
    
    for( const extEntry of candidates ) {

        try {
            const candidate = path.join(importPath, extEntry);
            if( fs.statSync(candidate).isFile() )
                return pathToFileURL(candidate).href;
        }
        catch( err ) {
            if( err instanceof Error && 'code' in err && err.code === 'ENOENT' ) continue;
            throw err; 
        }
    }
    throw new Error('unreachable - suggests empty translateExtMap');
}




if( import.meta.vitest ) {

    const { describe, it, expect, test } = import.meta.vitest;

    describe(`resolveTSEntryToSpec`, () => {

        it(`correctly parses with arguments: (import.meta.url)`, () => {
            expect(resolveTSEntryToSpec(import.meta.url)).toBe(import.meta.url);
        });

        it(`correctly parses with arguments: (import.meta.url)`, () => {
            const result = resolveTSEntryToSpec(new URL('.', import.meta.url));
            expect(result).toBeTypeOf('string');
            expect(result.endsWith('/__esbuild__/')).to.be.true;
        });

        it(`correctly parses with arguments ( '../__esbuild__/index.mts', import.meta.url )`, () => {
            const result = resolveTSEntryToSpec('../__esbuild__/index.mts', import.meta.url);
            expect(result).toBeTypeOf('string');
            expect(result.endsWith('/__esbuild__/index.mts')).to.be.true;
        });

    });

    describe(`exists`, () => {

        test.each`
            val | expected
            ${import.meta.url.replace('file://', '')} | ${true}
            ${import.meta.url} | ${true}
            ${new URL(import.meta.url)} | ${true}
            ${import.meta.url.replace('utils.mts', 'noexists.mts')} | ${false}
            ${new URL(import.meta.url.replace('.mts', '.dud'))} | ${false}
            ${import.meta.url.replace('file://', '').replace('.mts', '.dud')} | ${false}
        `(`%s -> $expected`, async ({val, expected}) => {
            expect(await exists(val)).toBe(expected);
        });


    });

}
