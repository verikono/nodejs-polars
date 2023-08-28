import { parse as pathParse } from 'node:path';

/** @ignore */
export function isPath(s: string, expectedExtensions?: string[]): boolean {
    const { base, ext, name } = pathParse(s);
    return Boolean(base && ext && name) && (Array.isArray(expectedExtensions) ? expectedExtensions.includes(ext) : true);
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.isPath", () => {

        test.each([
            [ "/directory/file.txt", true ],
        ])("%s -> %s",( value, expected ) => expect(isPath(value)).toBe(expected));

    });

}
