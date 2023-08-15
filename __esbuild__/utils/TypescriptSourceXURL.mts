import {
    parse as pathParse,
    join as pathJoin,
} from 'node:path';

import {
    type CompilerOptions,
    type SourceFile,
    getDefaultCompilerOptions,
    createProgram,
    forEachChild,
    isImportDeclaration
} from 'typescript';

import {
    type URLSpec,
    FSEntry,
    raise,
    resolveTSEntry,
    XURL,
} from './index.mjs';


export class TypescriptSourceXURL extends XURL {

    _ast?: SourceFile;
    compilerOptions = getDefaultCompilerOptions();


    constructor( entry: string|URL, base?:string|URL ) {
        super(resolveTSEntry(entry, base));
    }

    get ast(): SourceFile {
        
        let {
            pathname,
            compilerOptions: options
        } = this;
        
        this._ast = this._ast
            || createProgram({ options, rootNames: [ pathname ] }).getSourceFile(pathname)
            || raise(`failed parsing AST for ${this.href}`);
        
        return this._ast;
    }

    async getImportTree() {
        forEachChild( this.ast, ( node ) => {
            if( isImportDeclaration(node) ) {
                console.log('>>> import decl', node);
            }
        });
    }

    async getImportedURLs() {

        forEachChild( this.ast, ( node ) => {
            if( isImportDeclaration(node) ) {
                const { moduleSpecifier } = node;
                if( 'text' in moduleSpecifier ) {
                    const pathTo = moduleSpecifier.text as string;
                    if( pathTo.startsWith('./') ) {
                        const isFileUrl = !!pathParse(pathTo).ext;
                        const moduleURL = new TypescriptSourceXURL(pathTo, this);
                        console.log('\n\n?>>', moduleURL.href );
                        console.log(moduleURL.ast);
                    }
                    return;
                }
                console.warn('module specifier contained no actual string based specifier - continuing.');
            }
        });
    }

    public static async init( entry: FSEntry, base?: URLSpec|URL ): Promise<TypescriptSourceXURL> {

        const inst = new TypescriptSourceXURL(entry, base);
        return inst;
    }

}





if( import.meta.vitest ) {

    const { describe, it, expect } = import.meta.vitest;

    describe(`TypescriptSourceURL`, () => {

        let instance: TypescriptSourceXURL;

        it(`instantiates`, () => {
            instance = new TypescriptSourceXURL('../../polars/index.ts', import.meta.url);
            expect(instance).toBeInstanceOf(TypescriptSourceXURL);
            expect(instance).toBeInstanceOf(XURL);
            expect(instance.href).toBe(new URL('../../polars/index.ts', import.meta.url).href);
        });

        it.skip(`retrieves imports as a list of URLs`, async () => {
            const imports = await instance.getImportedURLs();
            console.log(imports);
        });

    });

}
