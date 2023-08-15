import {
    statSync,
} from 'node:fs';

import {
    existsSync,
} from '../../xfs/index.mjs';

export declare type FSURLTraitsName = "FS";

export declare type FSURLEntryTypes = "file" | "directory";

/** URL Specifier for local filesystem entries */
export declare type FSURLSpec = `${'file:///'}${string}`;

export declare type FSDirURLSpec = FSURLSpec & `${string}${'/'|'\\'}`;

export declare type FSFileURLSpec = FSURLSpec & `${string}${'.'}${string}`;


/** Regex @type {FSURLSpec} */
export const FSURLSpecRx = /^file:\/\/.+$/;


/** TypeGuard @type {FSURLSpec} */
export function isFSURLSpec( value: unknown ):value is FSURLSpec {
    if(typeof value === 'string' && !!value.length) {
        if(FSURLSpecRx.test(value)) {
            return true;
        }
    }
    return false;
}


export class FSURLTraits {

    href!:string;
    pathname!:string;

    public resourceTraits:FSURLTraitsName = "FS";
    private __entryType!: FSURLEntryTypes;
    private __exists!:boolean;
    private __isReadable!:boolean;
    private __isWritable!:boolean;
    private __mode!:number;

    get exists(): boolean {
        if(this.__exists === undefined)
            this.__exists = existsSync(this.href);
        return this.__exists;
    }

    get entryType():FSURLEntryTypes {
        if(this.__entryType === undefined)
            this.gainEntryProps();
        return this.__entryType;
    }

    get isReadable():boolean {
        this.__isReadable = true;
        return this.__isReadable;
    }

    get isWritable():boolean {
        this.__isWritable = true;
        return this.__isWritable;
    }


    private gainEntryProps() {
        try {
            const stats = statSync(this.pathname);
            this.__entryType = stats.isFile() ? 'file' : 'directory';
            return;
        }
        catch( err: any ) {
            switch(err.code) {
                case "ENOENT":
                    throw new Error(`attempted to gain filesystem entry properties on non-existant entry "${this.href}"`);
                default:
                    throw new Error(`FSURLTraits::gainEntryProps reached an unhandled exception for entry "${this.href}"`);
            }
        }

    }


}



export function applyFSURLTraits( instance: URL ): URL & FSURLTraits {
    const proto = FSURLTraits.prototype;
    const methodNames = Object.getOwnPropertyNames(proto);
    for(const methodName of methodNames) {
        if(methodName === "constructor") continue;
        const ref = Object.getOwnPropertyDescriptors(proto)[methodName];
        Object.defineProperty(instance, methodName, ref);

    }
    return instance as URL & FSURLTraits;
}



if( import.meta.vitest ) {

    const {
        beforeAll,
        describe,
        test,
        expect
    } = import.meta.vitest;


    describe(`applyFSURLTraits`, () => {

        let validFileInstance:URL & FSURLTraits;
        let validDirectoryInstance:URL & FSURLTraits;
        let validNoFileInstance: URL & FSURLTraits;
        let validNoDirectoryInstance:URL & FSURLTraits;

        beforeAll(() => {
            validFileInstance = applyFSURLTraits(new URL(import.meta.url));
            validDirectoryInstance = applyFSURLTraits(new URL('.', import.meta.url))
            validNoFileInstance = applyFSURLTraits(new URL('./nofilehere.txt', import.meta.url))
            validNoDirectoryInstance = applyFSURLTraits(new URL('./noDirectoryHere/', import.meta.url))
        });

        describe(`valid instance: file resource`, () => {
            test(`instance is URL`, () => expect(validFileInstance).toBeInstanceOf(URL));
            test(`"exists" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validFileInstance, 'exists')?.get).toBeTypeOf('function'));
            test(`instance.exists is true`, () => expect(validFileInstance.exists).toBe(true));
            test(`"entryType" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validFileInstance, 'entryType')?.get).toBeTypeOf('function'));
            test(`instance.entryType is "file"`, () => expect(validFileInstance.entryType).toBe("file"));
        });

        describe(`valid instance: directory resource`, () => {
            test(`instance is URL`, () => expect(validDirectoryInstance).toBeInstanceOf(URL));
            test(`"exists" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validDirectoryInstance, 'exists')?.get).toBeTypeOf('function'));
            test(`instance.exists is true`, () => expect(validDirectoryInstance.exists).toBe(true));
            test(`"entryType" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validDirectoryInstance, 'entryType')?.get).toBeTypeOf('function'));
            test(`instance.entryType is "directory"`, () => expect(validDirectoryInstance.entryType).toBe("directory"));
        });

        describe(`valid instance: file resource (non-existant)`, () => {
            test(`instance is URL`, () => expect(validNoFileInstance).toBeInstanceOf(URL));
            test(`"exists" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validNoFileInstance, 'exists')?.get).toBeTypeOf('function'));
            test(`instance.exists is false`, () => expect(validNoFileInstance.exists).toBe(false));
            test(`"entryType" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validNoFileInstance, 'entryType')?.get).toBeTypeOf('function'));
        });

        describe(`valid instance: directory resource (non-existant)`, () => {
            test(`instance is URL`, () => expect(validNoDirectoryInstance).toBeInstanceOf(URL));
            test(`"exists" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validNoDirectoryInstance, 'exists')?.get).toBeTypeOf('function'));
            test(`instance.exists is false`, () => expect(validNoDirectoryInstance.exists).toBe(false));
            test(`"entryType" exists as getter`, () => expect(Object.getOwnPropertyDescriptor(validNoDirectoryInstance, 'entryType')?.get).toBeTypeOf('function'));    
        });

    });

}
