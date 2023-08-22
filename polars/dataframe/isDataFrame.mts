import {
    type DataFrame,
} from './index.mjs';

export const isDataFrame = (anyVal: any): anyVal is DataFrame =>
    anyVal?.[Symbol.toStringTag] === "DataFrame";
