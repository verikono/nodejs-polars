import {
    type FSEntry,
    type URLSpec,
} from '../index.mjs';

import {
    type FSURLSpec,
    type FSURLTraits, 
    type HttpsURLSpec,
    type HttpsURLTraits,
    type URLTypes,
    type ResourceTypeMap,
    getResourceTraits,
} from './resourceTraits/index.mjs';

import {
    getFormatTraits
} from './formatTraits/index.mjs';

import {
    type FSPath
} from '../xpath/index.mjs';

type ListenerFn = ( ...args:any[] ) => void;

type RegisteredListener = {
    fn: ListenerFn;
    event: string;
}

export class XURL extends URL {

    initializers: string[] = [];
    resourceTraits: string[] = [];
    formatTraits: string[] = [];
    listeners: RegisteredListener[] = [];

    private constructor( entry: URLSpec|URL, base?:URLSpec|URL ) {
        super(entry, base);
        this.applyTraits();
    }

    public on( eventName: string, listener:( ...args:any[] ) => void ):void {

    }

    private executeInitializers() {
        for(const name of this.__initializers) {
            if(typeof this[name] === 'function') {

            }
        }
    }

    private applyTraits() {

        const {
            getOwnPropertyDescriptors: getDescriptors
        } = Object;
        
        const resourceTraits = getResourceTraits(this.href);
        const formatTraits = getFormatTraits(this.href);

        for(const Traits of [resourceTraits, formatTraits]) {
            if(typeof Traits === "function" && 'prototype' in Traits) {
        
                const {
                    prototype: proto,
                    prototype: {
                        constructor: TraitsCtor
                    }
                } = Traits;

                Object.entries(
                    Object.assign({}, getDescriptors(proto), getDescriptors(new TraitsCtor())) )
                .forEach(([name, desc]) => {
                    switch( name ) {
                        case 'constructor':
                        case 'href':
                        case 'pathname':
                            break;
                        case 'resourceTraits':
                        case 'formatTraits':
                            this[name].push(desc.value);
                            break;
                        default:
                            Object.defineProperty(this, name, desc);
                    }
                });

                continue;
            }
            else {
                throw new Error(`failed applying traits - imported trait set was deemed invalid.`);
            }
        }
    }


    public static async init( entry: FSURLSpec, base?: undefined ): Promise<XURL & FSURLTraits>;
    public static async init( entry: HttpsURLSpec, base?: undefined ): Promise<XURL & HttpsURLTraits>;
    public static async init<T extends URLTypes>( entry: FSPath|URLSpec|URL, base?: undefined ): Promise<XURL & ResourceTypeMap[T]>;
    public static async init( entry, base?:URLSpec|URL ) {
        const inst = new XURL(entry, base);

        return inst;
    }


    public static initSync( entry: FSURLSpec, base?: undefined ): XURL & FSURLTraits;
    public static initSync( entry: HttpsURLSpec, base?: undefined ): XURL & HttpsURLTraits;
    public static initSync<T extends "file"|"https">( entry: FSPath|URLSpec|URL, base?: undefined ): XURL & ResourceTypeMap[T];
    public static initSync( entry, base?: URLSpec|URL ) {
        const inst = new XURL(entry, base);
        return inst;
    }

}




if( import.meta.vitest ) {

    const {
        beforeAll,
        describe,
        expect,
        it,
        test,
    } = import.meta.vitest;

    describe(`XURL`, () => {

        describe(`import this file async`, () => {

            let instance;

            beforeAll( async () => { instance = await XURL.init(import.meta.url) });

            it(`instances as a XURL (async)`, () => expect(instance).toBeInstanceOf(XURL));
            it(`instance is identified as a file`, () => expect(instance.entryType).toBe("file"));
            it(`instance is identified as typescript formatted`, () => expect(instance.formatType).toBe("typescript"));

        });

    });

}
