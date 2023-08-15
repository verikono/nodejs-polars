import {
    access,
    constants,
} from 'node:fs/promises';



import * as fs from 'node:fs';

import {
    type FSPath,
    type AbsFSPath,
    type RelFSPath,
    isAbsFSPath,
    isRelFSPath,
} from '../xpath/index.mjs';

import {
    type FSURLSpec,
} from '../xurl/index.mjs';

export declare type FSEntry = FSPath | FSURLSpec | URL;
export declare type AbsFSEntry = AbsFSPath | FSURLSpec | URL;

export declare type ExistsParams = {

    /** Include a readability test as well */
    isReadable: boolean;

    /** Include a readability test as well */
    isWriteable: boolean;

    /** Set the Relative Base - default the process CWD */
    base: AbsFSEntry;

};


/** Exists Options */
export declare type ExistsOptions = Partial<ExistsParams>;


/** Default options for Exists Function */
export const ExistsDefaults: ExistsParams = {
    isReadable: false,
    isWriteable: false,
    base: process.cwd(),
};


/**
 * Perform an exist check on a filesystem entry as a path, URL specifier or a URL instance. Optionally with Read/Write accessiblity tests.
 * 
 * @param {AbsFSPath|URLSpec|URL} entry filesystem entry to test existance for.
 * @param {ExistsOptions} options extended tests
 * @returns {Promise<boolean>}
 * @todo - account for options.base
 */
export async function exists(
    entry: AbsFSPath|FSURLSpec|URL,
    options: ExistsOptions = ExistsDefaults 
): Promise<boolean> {
    
    const entryPath = entry instanceof URL ? entry.pathname : entry.replace(/^file:\/\//, '');

    if(isAbsFSPath(entryPath)) {
        try {
            await access(entryPath, constants.F_OK);
            return true;
        }
        catch( err ) {
            if( err instanceof Error ) {
                if( err['code'] === 'ENOENT' )
                    return false;
                throw err;
            }
        }
        throw new Error(`unhandled exception reached.`);
    }
    throw new Error(`invalid entry argument.`);
}


export function existsSync(
    entry: AbsFSPath|FSURLSpec|URL,
    options: ExistsOptions = ExistsDefaults
): boolean {
    const entryPath = entry instanceof URL ? entry.pathname : entry.replace(/^file:\/\//, '');
    if( isAbsFSPath(entryPath) ) {
        try {
            fs.accessSync(entryPath, constants.F_OK);
            return true;
        }
        catch( err ) {
            if( err instanceof Error ) {
                if( err['code'] === 'ENOENT' )
                    return false;
                throw err;
            }
        }
        throw new Error(`unhandled exception reached.`);
    }
    throw new Error(`invalid entry argument.`);
}


if( import.meta.vitest ) {

    const {
        describe,
        expect,
        test
    } = import.meta.vitest;


    describe(`exists`, () => {

        test.each`
            value|expected
            ${import.meta.url.replace('file://', '')} | ${true}
            ${import.meta.url} | ${true}
            ${new URL(import.meta.url)} | ${true}
            ${import.meta.url.replace('.mts', '.dud')} | ${false}
            ${new URL(import.meta.url.replace('.mts', '.dud'))} | ${false}
            ${import.meta.url.replace('file://', '').replace('.mts', '.dud')} | ${false}
        `(`$value -> $expected`, async ({value, expected}) => {
            expect(await exists(value)).toBe(expected);
        });


    });

    describe(`existsSync`, () => {

        test.each`
            value|expected
            ${import.meta.url.replace('file://', '')} | ${true}
            ${import.meta.url} | ${true}
            ${new URL(import.meta.url)} | ${true}
            ${import.meta.url.replace('.mts', '.dud')} | ${false}
            ${new URL(import.meta.url.replace('.mts', '.dud'))} | ${false}
            ${import.meta.url.replace('file://', '').replace('.mts', '.dud')} | ${false}
        `(`$value -> $expected`, ({value, expected}) => {
            expect(existsSync(value)).toBe(expected);
        });


    });

}
