/**
 * A trait for cumulative operations.
 */
export interface Cumulative<T> {
    /**
     * Get an array with the cumulative count computed at every element.
     * @category Cumulative
     */
    cumCount(reverse?: boolean): T;
    cumCount({ reverse }: { reverse: boolean }): T;
    /**
     * __Get an array with the cumulative max computes at every element.__
     * ___
     * @param reverse - reverse the operation
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.cumMax()
     * shape: (3,)
     * Series: 'b' [i64]
     * [
     *         1
     *         2
     *         3
     * ]
     * ```
     * @category Cumulative
     */
    cumMax(reverse?: boolean): T;
    cumMax({ reverse }: { reverse: boolean }): T;
    /**
     * __Get an array with the cumulative min computed at every element.__
     * ___
     * @param reverse - reverse the operation
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.cumMin()
     * shape: (3,)
     * Series: 'b' [i64]
     * [
     *         1
     *         1
     *         1
     * ]
     * ```
     * @category Cumulative
     */
    cumMin(reverse?: boolean): T;
    cumMin({ reverse }: { reverse: boolean }): T;
    /**
     * __Get an array with the cumulative product computed at every element.__
     * ___
     * @param reverse - reverse the operation
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.cumProd()
     * shape: (3,)
     * Series: 'b' [i64]
     * [
     *         1
     *         2
     *         6
     * ]
     * ```
     * @category Cumulative
     */
    cumProd(reverse?: boolean): T;
    cumProd({ reverse }: { reverse: boolean }): T;
    /**
     * __Get an array with the cumulative sum computed at every element.__
     * ___
     * @param reverse - reverse the operation
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.cumSum()
     * shape: (3,)
     * Series: 'b' [i64]
     * [
     *         1
     *         3
     *         6
     * ]
     * ```
     * @category Cumulative
     */
    cumSum(reverse?: boolean): T;
    cumSum({ reverse }: { reverse: boolean }): T;
}
