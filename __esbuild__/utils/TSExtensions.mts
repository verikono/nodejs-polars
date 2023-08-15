
export declare type JSExt = '.mjs' | '.cjs' | '.js' | '.d.ts' | '.d.mts' | '.d.cts';
export declare type TSExt = '.mts' | '.cts' | '.ts' | '.d.ts' | '.d.mts' | '.d.cts';

export declare type JSExtMap = Map<JSExt, TSExt>;
export declare type TSExtMap = Map<TSExt, JSExt>;


export const tsExtensionMap: TSExtMap = new Map([
    ['.mts', '.mjs'],
    ['.ts', '.js'],
    ['.cts', '.cjs'],
    ['.d.ts', '.d.ts'],
    ['.d.mts', '.d.mts'],
    ['.d.cts', '.d.cts'],
]);


export const jsExtensionMap: JSExtMap = new Map([
    ['.mjs', '.mts'],
    ['.js', '.ts'],
    ['.cjs', '.cts'],
    ['.d.ts', '.d.ts'],
    ['.d.mts', '.d.mts'],
    ['.d.cts', '.d.cts'],
]);


export const allExtensions = new Set<JSExt|TSExt>([
    ".mjs", ".mts", ".cjs", ".cts", ".js", ".ts",
    ".d.mts", ".d.cts", ".d.ts"
]);





if(import.meta.vitest) {

    const { test, expect } = import.meta.vitest;

    test(`tsExtensionMap resolves .mts to .mjs`, () =>
        expect(tsExtensionMap.get(".mts")).toBe('.mjs'));

    test(`jsExtensionMap resolves .mjs to .mts`, () =>
        expect(jsExtensionMap.get(".mjs")).toBe('.mts'));

}
