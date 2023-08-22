import {
    type DataFrame
} from './index.mjs';


/**
 * Map over dataframe rows.
 * @param {DataFrame} df the subject dataframe. {@link DataFrame} 
 * @param {(...args: unknown[]) => unknown[]} fn the mapper function. 
 * @returns {ReturnType<fn>}
 */
export function map( df: DataFrame, fn: (...args: any[]) => any[]) {
    return df.rows().map(fn);
}
  