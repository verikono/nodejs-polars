import {
    assertType,
    describe,
    expect,
    test,
} from 'vitest';



describe("nodejs-polars/datatypes", () => {

    test("exports class Field", async () => {
        const { Field } = await import("nodejs-polars/datatype");
    });

});
