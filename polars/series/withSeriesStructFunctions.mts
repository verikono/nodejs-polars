class SS {
    decore( name: string ):void {
        console.log('SS', name);
    }
}



export function withFunctions( source ) {
    return function apply<TC>( target:TC ):TC & typeof source {
        Object.getOwnPropertyNames(source).forEach(prop => {
            // target[prop] = source[prop].bind(target);
        });
        return source;
    }
}



if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/series/withSeriesStructFunctions", () => {

        @withFunctions(SS)
        class TestClass {

            constructor() {

            }

            
            initializerz() {

            }

        }

        test("", async () => {

            const inst = new TestClass();
            expect(inst.decore).toBeTypeOf('function');

        });

    });

}

