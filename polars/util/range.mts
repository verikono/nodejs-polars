/**
 * @todo document this.
 * 
 * @param start 
 * @param end 
 * @returns 
 */
export const range = (start: number, end: number) => {

    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
};




if (import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.range", () => {

        test("", async () => {


        });

    });

}
