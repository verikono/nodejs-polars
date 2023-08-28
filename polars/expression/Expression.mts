/**
 * 
 */
export class Expression {
    
    /**
     * @public
     * @constructor
     * @param value 
     */
    constructor( value:unknown ) {

    }

}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/expr.ExprClass", () => {

        let instance:Expression;

        beforeAll(async () => {
            instance = (await import('nodejs-polars/expression')).Expression;
        });

        test("instantiates", () => expect(instance).toBeInstanceOf(Expression));

    });

}
