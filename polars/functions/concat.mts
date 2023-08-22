import { isDataFrameArray } from 'nodejs-polars/utils';

import {
    type DataFrame,
} from 'nodejs-polars/dataframe';

import {
    type Series,
} from 'nodejs-polars/series';




/**
 * Aggregate all the Dataframes/Series in a List of DataFrames/Series to a single DataFrame/Series.
 * @param items DataFrames/Series/LazyFrames to concatenate.
 * @param options.rechunk rechunk the final DataFrame/Series.
 * @param options.how Only used if the items are DataFrames. *Defaults to 'vertical'*
 *     - Vertical: Applies multiple `vstack` operations.
 *     - Horizontal: Stacks Series horizontally and fills with nulls if the lengths don't match.
 *
 * @example
 * > const df1 = pl.DataFrame({"a": [1], "b": [3]})
 * > const df2 = pl.DataFrame({"a": [2], "b": [4]})
 * > pl.concat([df1, df2])
 * shape: (2, 2)
 * ┌─────┬─────┐
 * │ a   ┆ b   │
 * │ --- ┆ --- │
 * │ i64 ┆ i64 │
 * ╞═════╪═════╡
 * │ 1   ┆ 3   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 2   ┆ 4   │
 * └─────┴─────┘
 */
export function concat( items: Array<DataFrame>, options?: ConcatOptions ): DataFrame;
export function concat<T>( items: Array<Series>, options?: { rechunk: boolean } ): Series;
export function concat<T>( items, options: ConcatOptions = { rechunk: true, how: "vertical" } ) {

    const {
        rechunk,
        how,
    } = options;
  
    if (!items.length) {
        throw new RangeError("cannot concat empty list");
    }
  
    if (isDataFrameArray(items)) {
      let df;
      if (how === "vertical") {
        df = items.reduce((acc, curr) => acc.vstack(curr));
      } else {
        df = _DataFrame(pli.horizontalConcat(items.map((i: any) => i.inner())));
      }
  
      return rechunk ? df.rechunk() : df;
    }
  
    if (isSeriesArray<T>(items)) {
      const s = items.reduce((acc, curr) => acc.concat(curr));
  
      return rechunk ? s.rechunk() : s;
    }
    throw new TypeError("can only concat series and dataframes");
  }
  