import {
    assertType,
    describe,
    expect,
    test,
} from 'vitest';

import { arrayToJsDataFrame, type arrayToJsDataFrame as ArrayToDataFrameFn } from './arrayToJsDataFrame.mjs';

describe(`[types] nodejs-polars/internals`, () => {

    describe(`arrayToJsDataFrame`, () => {

        test(`function is exported by package`, () =>{
            assertType<ArrayToJsDataFrameFn>(arrayToJsDataFrame);
        })
    });
    test(``)

});
