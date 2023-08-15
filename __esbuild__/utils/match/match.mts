/**
 * 
 * @param expr 
 * @returns 
 */
export async function match<T>( expr: (() => T|undefined)[] ): Promise<T> {

    if( Array.isArray(expr) ) {
        for( const exp of expr ) {
            const result = await exp();
            if( result !== undefined ) return result;
        }
    }
    throw new Error(`match failed to resolve from ${expr.length} evaluations`);

}


export function matchSync<T>( expr: (() => T|undefined)[] ): T {

    if( Array.isArray(expr) ) {
        for( const exp of expr ) {
            const result = exp();
            if( result !== undefined ) return result;
        }
    }
    throw new Error(`match failed to resolve from ${expr.length} evaluations`);
}





if( import.meta.vitest ) {

    const {
        describe,
        expect,
        it
    } = import.meta.vitest;
    
    describe(`match`, () => {
        it(``, async () => {
            expect(await match([
                () => undefined,
                () => {},
                () => "pass"
            ])).toBe("pass");
        });
    });
    
    describe(`matchSync`, () => {
        it(``, async () => {
            expect(matchSync([
                () => undefined,
                () => {},
                () => "pass"
            ])).toBe("pass");
        });
    })
}
