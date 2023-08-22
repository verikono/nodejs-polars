import {
    type ValueOrArray,
} from './index.mjs';



/** @ignore */
export function columnOrColumnsStrict( ...columns: string[] | ValueOrArray<string>[] ): Array<string> {
    return columns.flat(3) as any;
}

