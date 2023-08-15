

export declare type TSESMExt = ".mts";
export declare type TSCJSExt = ".cts";
export declare type TSGenericExt = ".ts";
export declare type TSDeclarationExt = `.d${TSESMExt|TSCJSExt|TSGenericExt}`;
export declare type TSExt = TSESMExt | TSCJSExt | TSGenericExt | TSDeclarationExt;

export declare type TSESMFile = `${string}${TSESMExt|TSExt}`;
export declare type TSCJSFile = `${string}${TSCJSExt|TSExt}`;
export declare type TSGenericFile = `${string}${TSExt}`;
export declare type TSDeclarationFile = `${string}${TSDeclarationExt}`;
export declare type TSFile = TSESMFile | TSCJSFile | TSGenericFile | TSDeclarationFile;

export const TSExtensions: TSExt[] = [ ".mts", ".cts", ".ts", ".d.mts", ".d.cts", ".d.ts" ];

export class TypescriptFormatTraits {

    pathname!:string;
    href!:string;
    
    formatType = "typescript";
    formatTraits = "typescript";
    __initializers = [ 'resolveSpecifier' ];

    resolveSpecifier(): void {
        // is pathname a file?
            // return, this should resolve as is.
        // is pathname a directory?
            // yes - check pathname+"/index.{mts,cts,ts}"
    }

}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        it,
        test,
        expect,
        expectTypeOf
    } = import.meta.vitest;

   

    describe(`xurl.formatTraits.TypescriptFormatTraits`, () => {

        type TraitedXURL = typeof import('../index.mjs').XURL & {
            resourceTraits: string[];
            formatTraits: string[];
            formatType: string;
        };

        let XURL;
       
        beforeAll( async () => {
            XURL = (await import('../index.mjs')).XURL;
        });

        describe(`resolveSpecifier`, () => {

            describe(`resolve with URL specifier pointing at file directly`, () => {
                let url:TraitedXURL & { resourceTraits: string; formatTraits: string; };
                beforeAll(async () => { url = await XURL.init(import.meta.url)});
                test(`instantiated`, () => expect(url).toBeInstanceOf(XURL));
                test(`identifies resource type`, () => expect(url.resourceTraits.includes('FS')).toBe(true));
                test(`identifies format traits`, () => expect(url.formatTraits.includes('typescript')).toBe(true));
                test(`identifies format type`, () => expect(url.formatType).toBe('typescript'));
            });

            describe(`resolve ./index.mts with URL specifier pointing at this directory`, () => {
                let url:TraitedXURL & { resourceTraits: string; formatTraits: string; };
                beforeAll(async () => { url = await XURL.init('.', import.meta.url)});
                // test(`instantiated`, () => expect(url).toBeInstanceOf(XURL));
                // test(`identifies resource type`, () => expect(url.resourceTraits.includes('FS')).toBe(true));
                // test(`identifies format traits`, () => expect(url.formatTraits.includes('typescript')).toBe(true));
                // test(`identifies format type`, () => expect(url.formatType).toBe('typescript'));
            });

        });

    });

}
