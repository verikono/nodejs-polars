import { Bool } from './types/Bool.mjs';
import { Time } from './types/Time.mjs';
Bool; Time;
export { PLRDataType } from './PLRDataType.mjs';
// export const { PLRDataType } = await import('./PLRDataType.mjs');
// import { DataType } from './DataType.mjs';

// export * as types from './types/index.mjs'
// export { DataType } from './DataType.mjs';
// export { Field } from './Field.mjs';
// export { TimeUnit } from './TimeUnit.mjs';
// export { polarsTypeToConstructor } from './polarsTypeToConstructor.mjs';

// export {
//     DTYPE_TO_FFINAME,
//     POLARS_TYPE_TO_CONSTRUCTOR,
// } from './const.mjs';

// export default DataType;





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/datatype [index]", () => {

        describe("PLRDataType", () => {

            test("imports dynamically", async () => {
                expect(true).toBeTruthy();
                // const { PLRDataType:ImportedPLRDataType } = await import("nodejs-polars/datatype");
                // console.log('>>');
            })

        });

    });

}
