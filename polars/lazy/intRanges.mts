import {
    type Expr,
    type Series,
} from 'nodejs-polars';

/***
 * Generate a range of integers for each row of the input columns.
 * @param start - Lower bound of the range (inclusive).
 * @param end - Upper bound of the range (exclusive).
 * @param step - Step size of the range.
 * @param eager - Evaluate immediately and return a ``Series``. If set to ``False`` (default), return an expression instead.
 * @return - Column of data type ``List(dtype)``.
 *  * @example
 * ```
 * const df = pl.DataFrame({"a": [1, 2], "b": [3, 4]})
 * const result = df.select(pl.intRanges("a", "b"));
 * ```
 */

export function intRanges(
    start: any,
    end: any,
    step?: number,
    eager?: false,
): Expr;
export function intRanges(
    start: any,
    end: any,
    step?: number,
    eager?: true,
): Series;
export function intRanges(
    start: any,
    end: any,
    step = 1,
    eager?: boolean,
): Series | Expr {
    start = exprToLitOrExpr(start, false);
    end = exprToLitOrExpr(end, false);

    if (eager) {
        const df = DataFrame({ a: [1] });

        return df
            .select(intRanges(start, end, step).alias("intRanges") as any)
            .getColumn("intRanges") as any;
    }

    return _Expr(pli.intRanges(start, end, step, eager));
}
