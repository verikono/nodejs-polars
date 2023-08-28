export const isIterator = <T extends object = {}>(ty: any): ty is Iterable<T> => ty !== null && typeof ty[Symbol.iterator] === "function";




if (import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.isIterator", () => {

        test("", async () => {


        });

    });

}

