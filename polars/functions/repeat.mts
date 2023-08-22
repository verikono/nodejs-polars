import {
    jsTypeToPolarsType,
    pli,
} from 'nodejs-polars/internals';

import {
    _Series,
} from 'nodejs-polars/series';


/**
 * _Repeat a single value n times and collect into a Series._
 * @param value - Value to repeat.
 * @param n - Number of repeats
 * @param name - Optional name of the Series
 * @example
 *
 * ```
 *
 * >  const s = pl.repeat("a", 5)
 * >  s.toArray()
 * ["a", "a", "a", "a", "a"]
 *
 * ```
 */
export function repeat<V>(value: V, n: number, name = ""): Series {
    const dtype = jsTypeToPolarsType(value);
    const s = pli.JsSeries.repeat(name, value, n, dtype);

    return _Series(s) as any;
}

