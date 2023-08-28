import { JsDataFrame } from 'nodejs-polars/bindings';

// import {
//     type SeriesOptions,
// } from 'nodejs-polars/types/options';

// import {
//     type Arithmetic,

// } from "nodejs-polars/types/traits";

// import {
//     arrayToJsDataFrame
// } from 'nodejs-polars/internals';

// import { AbstractDataFrame } from "./AbstractDataFrame.mjs";
// import { isEntry } from 'nodejs-polars/util';
// import { objToDF } from "./objToDF.mjs";

// import { JsDataFrame } from 'nodejs-polars/bindings';


export class PLRDataFrame extends JsDataFrame {

    constructor(data: (string | number)[], options: any = {}) {

        super(data);
        // if(isEntry(data)) return new PLRDataFrame(objToDF(data));
        // if(Array.isArray(data)) return new PLRDataFrame(arrayToJsDataFrame(data, options));
    }

}





if (import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        // expect,
    } = import.meta.vitest;

    describe("nodejs-polars/dataframe.PLRDataFrame", () => {

        describe(`instantiates from 3 basic entries`, () => {

            let instance: PLRDataFrame;

            beforeAll(() => {
                instance = new PLRDataFrame([1, 2, 3]);
            })


            test("instantiates", () => {
                console.log('instance', instance);
            });

        });

    });

}
