import {
    access,
    constants
} from 'node:fs/promises';

import {
    isAbsolute,
    join as pathJoin,
} from 'node:path';

import {
    pathToFileURL
} from 'node:url';

import {
    raise
} from './utils.mjs';

import * as ts from 'typescript';

import {
    type CompilerOptions,
    type CreateProgramOptions,
    type Node,
    forEachChild,
    createProgram,
    createCompilerHost,
    createScanner,
    ProgramHost,
} from 'typescript';


type getImportTreeParams = {
    cwd: URL;
    tsconfig: string | URL;
    compilerOptions: CompilerOptions;
}

type getImportTreeOptions = Partial<getImportTreeParams>;

const getImportTreeDefaults: getImportTreeParams = {
    cwd: new URL(pathToFileURL(process.cwd())),
    tsconfig: './tsconfig.json',
    compilerOptions: {}
};

export async function getImportTree( root: string|string[]|URL|URL[], options: getImportTreeParams = getImportTreeDefaults ): Promise<URL[]> {

    const { compilerOptions, cwd } = options;

    const rootNames = ( Array.isArray(root) ? root : [ root ] )
        .map( root => root instanceof URL ? root.pathname : root )
        .map( filePath => isAbsolute(filePath) ? filePath : pathJoin(cwd.pathname, filePath) );

    const importTree = {
        files: [],
        tree: {}
    }

    let keyPath = [];


    for( const sourceFilePath of rootNames ) {
        
        await access(sourceFilePath, constants.R_OK);
        
        const program = ts.createProgram({ options: compilerOptions, rootNames:[ sourceFilePath ] });
        const sourceFile = program.getSourceFile(sourceFilePath)
            || raise(`failed reading source from ${sourceFilePath}`);
        
        forEachChild( sourceFile, ( node ) => {
            extractNodeType(node, 111);
        });
    
    }


    return [ new URL(import.meta.url) ];

} 

export async function extractNodeType( node: Node, options: {recursive:boolean} = { recursive: false } ): string[] {

    if( ts.isImportDeclaration(node) ) {
        const { moduleSpecifier, importClause } = node;
        if( importClause ) {
            console.log('>> import declaration', node ); //importClause.namedBindings);
            // console.log(node);
        }
    }

    if( ts.isExportDeclaration(node) ) {
    }

    return [];
}

export async function resolveFileFromSpecifier( spec: string, base: URL ): Promise<URL> {
    const exts = [ '.ts', '.mts', '.cts' ];
}


if( import.meta.vitest ) {

    const { describe, it, expect } = import.meta.vitest;

    describe(`getImportTree`, () => {

        it(`getImportTree is a function`, async () => expect(getImportTree).toBeTypeOf('function'));
        it(`parses typescript imports when argued a URL`, async () => {
            const result = await getImportTree(new URL('../polars/index.ts', import.meta.url));
            console.log(result);
        });
        it.todo(`returns an array`)
        it.todo(`returns an array of URLs`);
        it.todo(`all URLs resolve to a typescript file`);
    });
}
