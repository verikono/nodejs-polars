export function match( ...fns:(() => any)[] ) {
    for( const fn of fns ) {
        const result = fn();
        if( result !== undefined )
            return result;
    }
    throw new Error(``)
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/util.match", () => {

        test("resolves the first non-undefined value", async () => {
            const result = match(
                () => undefined,
                () => 2,
                () => undefined
            );
            expect(result).toBe(2);
        });

    });

}
