import { type DataFrame } from 'nodejs-polars/dataframe';

export type ListNamespace = ListFunctions<Series>;

export type SeriesDateFunctions = DateFunctions<Series>;

export interface ISeriesStructFunctions {
    fields: string[];
    toFrame(): DataFrame;
    field(name: string): Series;
    renameFields(names: string[]): Series;
}

export interface Series
    extends ArrayLike<any>,
    Rolling<Series>,
    Arithmetic<Series>,
    Comparison<Series>,
    Cumulative<Series>,
    Round<Series>,
    Sample<Series>,
    Serialize {
    inner(): any;
    name: string;
    dtype: DataType;
    str: StringNamespace;
    lst: ListNamespace;
    struct: SeriesStructFunctions;
    date: SeriesDateFunctions;
    [inspect](): string;
    [Symbol.iterator](): IterableIterator<any>;
    // inner(): JsSeries
    bitand(other: Series): Series;
    bitor(other: Series): Series;
    bitxor(other: Series): Series;
    /**
     * Take absolute values
     */
    abs(): Series;
    /**
     * __Rename this Series.__
     *
     * @param name - new name
     * @see {@link rename}
     *
     */
    alias(name: string): Series;
    /**
     * __Append a Series to this one.__
     * ___
     * @param {Series} other - Series to append.
     * @example
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  const s2 = pl.Series("b", [4, 5, 6])
     * >  s.append(s2)
     * shape: (6,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     *         4
     *         5
     *         6
     * ]
     */
    append(other: Series): void;
    // TODO!
    // /**
    //  * __Apply a function over elements in this Series and return a new Series.__
    //  *
    //  * If the function returns another datatype, the returnType arg should be set, otherwise the method will fail.
    //  * ___
    //  * @param {CallableFunction} func - function or lambda.
    //  * @param {DataType} returnType - Output datatype. If none is given, the same datatype as this Series will be used.
    //  * @returns {SeriesType} `Series<T> | Series<returnType>`
    //  * @example
    //  * ```
    //  * >  const s = pl.Series("a", [1, 2, 3])
    //  * >  s.apply(x => x + 10)
    //  * shape: (3,)
    //  * Series: 'a' [i64]
    //  * [
    //  *         11
    //  *         12
    //  *         13
    //  * ]
    //  * ```
    //  */
    // apply<U>(func: (s: T) => U): Series<U>
    /**
     * Get the index of the maximal value.
     */
    argMax(): Optional<number>;
    /**
     * Get the index of the minimal value.
     */
    argMin(): Optional<number>;
    /**
     * Get index values where Boolean Series evaluate True.
     *
     */
    argTrue(): Series;
    /**
     * Get unique index as Series.
     */
    argUnique(): Series;
    /**
     * Index location of the sorted variant of this Series.
     * ___
     * @param reverse
     * @return {SeriesType} indexes - Indexes that can be used to sort this array.
     */
    argSort(): Series;
    argSort(reverse: boolean): Series;
    argSort({ reverse }: { reverse: boolean }): Series;
    /**
     * __Rename this Series.__
     *
     * @param name - new name
     * @see {@link rename} {@link alias}
     *
     */
    as(name: string): Series;
    /**
     * Cast between data types.
     */
    cast(dtype: DataType, strict?: boolean): Series;
    /**
     * Get the length of each individual chunk
     */
    chunkLengths(): Array<any>;
    /**
     * Cheap deep clones.
     */
    clone(): Series;
    concat(other: Series): Series;

    /**
     * __Quick summary statistics of a series. __
     *
     * Series with mixed datatypes will return summary statistics for the datatype of the first value.
     * ___
     * @example
     * ```
     * >  const seriesNum = pl.Series([1,2,3,4,5])
     * >  series_num.describe()
     *
     * shape: (6, 2)
     * ┌──────────────┬────────────────────┐
     * │ statistic    ┆ value              │
     * │ ---          ┆ ---                │
     * │ str          ┆ f64                │
     * ╞══════════════╪════════════════════╡
     * │ "min"        ┆ 1                  │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "max"        ┆ 5                  │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "null_count" ┆ 0.0                │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "mean"       ┆ 3                  │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "std"        ┆ 1.5811388300841898 │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "count"      ┆ 5                  │
     * └──────────────┴────────────────────┘
     *
     * >  series_str = pl.Series(["a", "a", None, "b", "c"])
     * >  series_str.describe()
     *
     * shape: (3, 2)
     * ┌──────────────┬───────┐
     * │ statistic    ┆ value │
     * │ ---          ┆ ---   │
     * │ str          ┆ i64   │
     * ╞══════════════╪═══════╡
     * │ "unique"     ┆ 4     │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ "null_count" ┆ 1     │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ "count"      ┆ 5     │
     * └──────────────┴───────┘
     * ```
     */
    describe(): DataFrame;
    /**
     * Calculates the n-th discrete difference.
     * @param n - number of slots to shift
     * @param nullBehavior - `'ignore' | 'drop'`
     */
    diff(n: number, nullBehavior: "ignore" | "drop"): Series;
    diff({
        n,
        nullBehavior,
    }: { n: number; nullBehavior: "ignore" | "drop" }): Series;
    /**
     * Compute the dot/inner product between two Series
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  const s2 = pl.Series("b", [4.0, 5.0, 6.0])
     * >  s.dot(s2)
     * 32.0
     * ```
     */
    dot(other: Series): number | undefined | null;
    /**
     * Create a new Series that copies data from this Series without null values.
     */
    dropNulls(): Series;
    /**
     * __Explode a list or utf8 Series.__
     *
     * This means that every item is expanded to a new row.
     * ___
     * @example
     * ```
     * >  const s = pl.Series('a', [[1, 2], [3, 4], [9, 10]])
     * >  s.explode()
     * shape: (6,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     *         4
     *         9
     *         10
     * ]
     * ```
     */
    explode(): any;
    /**
     * Extend the Series with given number of values.
     * @param value The value to extend the Series with. This value may be null to fill with nulls.
     * @param n The number of values to extend.
     * @deprecated
     * @see {@link extendConstant}
     */
    extend(value: any, n: number): Series;
    /**
     * Extend the Series with given number of values.
     * @param value The value to extend the Series with. This value may be null to fill with nulls.
     * @param n The number of values to extend.
     */
    extendConstant(value: any, n: number): Series;
    /**
     * __Fill null values with a filling strategy.__
     * ___
     * @param strategy - Filling Strategy
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3, None])
     * >  s.fill_null('forward'))
     * shape: (4,)
     * Series: '' [i64]
     * [
     *         1
     *         2
     *         3
     *         3
     * ]
     * >  s.fill_null('min'))
     * shape: (4,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     *         1
     * ]
     * ```
     */
    fillNull(
        strategy: "backward" | "forward" | "min" | "max" | "mean" | "one" | "zero",
    ): Series;
    fillNull({
        strategy,
    }: {
        strategy: "backward" | "forward" | "min" | "max" | "mean" | "one" | "zero";
    }): Series;
    /**
     * __Filter elements by a boolean mask.__
     * @param {SeriesType} predicate - Boolean mask
     *
     */
    filter(predicate: Series): Series;
    filter({ predicate }: { predicate: Series }): Series;
    get(index: number): any;
    getIndex(n: number): any;
    /**
     * Returns True if the Series has a validity bitmask.
     * If there is none, it means that there are no null values.
     */
    hasValidity(): boolean;
    /**
     * Hash the Series
     * The hash value is of type `UInt64`
     * ___
     * @param k0 - seed parameter
     * @param k1 - seed parameter
     * @param k2 - seed parameter
     * @param k3 - seed parameter
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.hash(42)
     * shape: (3,)
     * Series: 'a' [u64]
     * [
     *   7499844439152382372
     *   821952831504499201
     *   6685218033491627602
     * ]
     * ```
     */
    hash(
        k0?: number | bigint,
        k1?: number | bigint,
        k2?: number | bigint,
        k3?: number | bigint,
    ): Series;
    hash({
        k0,
        k1,
        k2,
        k3,
    }: {
        k0?: number | bigint;
        k1?: number | bigint;
        k2?: number | bigint;
        k3?: number | bigint;
    }): Series;
    /**
     * __Get first N elements as Series.__
     * ___
     * @param length  Length of the head
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.head(2)
     * shape: (2,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     * ]
     * ```
     */
    head(length?: number): Series;
    /**
     * __Interpolate intermediate values.__
     *
     * The interpolation method is linear.
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, None, None, 5])
     * >  s.interpolate()
     * shape: (5,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     *         4
     *         5
     * ]
     * ```
     */
    interpolate(method?: InterpolationMethod): Series;
    /**
     * Check if this Series is a Boolean.
     */
    isBoolean(): boolean;
    /**
     * Check if this Series is a DataTime.
     */
    isDateTime(): boolean;
    /**
     * __Get mask of all duplicated values.__
     *
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 2, 3])
     * >  s.isDuplicated()
     *
     * shape: (4,)
     * Series: 'a' [bool]
     * [
     *         false
     *         true
     *         true
     *         false
     * ]
     * ```
     */
    isDuplicated(): Series;
    /**
     * Get mask of finite values if Series dtype is Float.
     */
    isFinite(): Series;
    /**
     * Get a mask of the first unique value.
     */
    isFirst(): Series;
    /**
     * Check if this Series is a Float.
     */
    isFloat(): boolean;
    /**
     * Check if elements of this Series are in the right Series, or List values of the right Series.
     */
    isIn<U>(other: Series | U[]): Series;
    /**
     * __Get mask of infinite values if Series dtype is Float.__
     * @example
     * ```
     * >  const s = pl.Series("a", [1.0, 2.0, 3.0])
     * >  s.isInfinite()
     *
     * shape: (3,)
     * Series: 'a' [bool]
     * [
     *         false
     *         false
     *         false
     * ]
     * ```
     */
    isInfinite(): Series;
    /**
     * __Get mask of non null values.__
     *
     * *`undefined` values are treated as null*
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1.0, undefined, 2.0, 3.0, null])
     * >  s.isNotNull()
     * shape: (5,)
     * Series: 'a' [bool]
     * [
     *         true
     *         false
     *         true
     *         true
     *         false
     * ]
     * ```
     */
    isNotNull(): Series;
    /**
     * __Get mask of null values.__
     *
     * `undefined` values are treated as null
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1.0, undefined, 2.0, 3.0, null])
     * >  s.isNull()
     * shape: (5,)
     * Series: 'a' [bool]
     * [
     *         false
     *         true
     *         false
     *         false
     *         true
     * ]
     * ```
     */
    isNull(): Series;
    /**
     * Check if this Series datatype is numeric.
     */
    isNumeric(): boolean;
    /**
     * __Get mask of unique values.__
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 2, 3])
     * >  s.isUnique()
     * shape: (4,)
     * Series: 'a' [bool]
     * [
     *         true
     *         false
     *         false
     *         true
     * ]
     * ```
     */
    isUnique(): Series;
    /**
     * Checks if this Series datatype is a Utf8.
     */
    isUtf8(): boolean;
    /**
     * __Compute the kurtosis (Fisher or Pearson) of a dataset.__
     *
     * Kurtosis is the fourth central moment divided by the square of the
     * variance. If Fisher's definition is used, then 3.0 is subtracted from
     * the result to give 0.0 for a normal distribution.
     * If bias is False then the kurtosis is calculated using k statistics to
     * eliminate bias coming from biased moment estimators
     * ___
     * @param fisher -
     * - If True, Fisher's definition is used (normal ==> 0.0).
     * - If False, Pearson's definition is used (normal ==> 3.0)
     */
    kurtosis(): Optional<number>;
    kurtosis(fisher: boolean, bias?: boolean): Optional<number>;
    kurtosis({
        fisher,
        bias,
    }: { fisher?: boolean; bias?: boolean }): Optional<number>;
    /**
     * __Length of this Series.__
     * ___
     * @example
     * ```
     * >  const s = pl.Series("a", [1, 2, 3])
     * >  s.len()
     * 3
     * ```
     */
    len(): number;
    /**
     * __Take `n` elements from this Series.__
     * ___
     * @param n - Amount of elements to take.
     * @see {@link head}
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s.limit(2)
     * shape: (2,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     * ]
     * ```
     */
    limit(n?: number): Series;
    /**
     * Get the maximum value in this Series.
     * @example
     * ```
     * > s = pl.Series("a", [1, 2, 3])
     * > s.max()
     * 3
     * ```
     */
    max(): number;
    /**
     * Reduce this Series to the mean value.
     * @example
     * ```
     * > s = pl.Series("a", [1, 2, 3])
     * > s.mean()
     * 2
     * ```
     */
    mean(): number;
    /**
     * Get the median of this Series
     * @example
     * ```
     * > s = pl.Series("a", [1, 2, 3])
     * > s.median()
     * 2
     * ```
     */
    median(): number;
    /**
     * Get the minimal value in this Series.
     * @example
     * ```
     * > s = pl.Series("a", [1, 2, 3])
     * > s.min()
     * 1
     * ```
     */
    min(): number;
    /**
     * __Compute the most occurring value(s). Can return multiple Values__
     * ___
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 2, 3])
     * s.mode()
     * shape: (1,)
     * Series: 'a' [i64]
     * [
     *         2
     * ]
     *
     * s = pl.Series("a", ['a', 'b', 'c', 'c', 'b'])
     * s.mode()
     * shape: (1,)
     * Series: 'a' [str]
     * [
     *         'b'
     *         'c'
     * ]
     * ```
     */
    mode(): Series;
    /**
     * Get the number of chunks that this Series contains.
     */
    nChunks(): number;
    /**
     * __Count the number of unique values in this Series.__
     * ___
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 2, 3])
     * s.nUnique()
     * 3
     * ```
     */
    nUnique(): number;
    /**
     * Count the null values in this Series. --
     * _`undefined` values are treated as null_
     *
     */
    nullCount(): number;
    /**
     * Get a boolean mask of the local maximum peaks.
     * ___
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3, 4, 5])
     * s.peakMax()
     * shape: (5,)
     * Series: '' [bool]
     * [
     *         false
     *         false
     *         false
     *         false
     *         true
     * ]
     * ```
     */
    peakMax(): Series;
    /**
     * Get a boolean mask of the local minimum peaks.
     * ___
     * @example
     * ```
     * s = pl.Series("a", [4, 1, 3, 2, 5])
     * s.peakMin()
     * shape: (5,)
     * Series: '' [bool]
     * [
     *         false
     *         true
     *         false
     *         true
     *         false
     * ]
     * ```
     */
    peakMin(): Series;
    /**
     * Get the quantile value of this Series.
     * ___
     * @param quantile
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s.quantile(0.5)
     * 2
     * ```
     */
    quantile(quantile: number, interpolation?: string): number;
    /**
     * Assign ranks to data, dealing with ties appropriately.
     * @param method
     * The method used to assign ranks to tied elements.
     * The following methods are available: _default is 'average'_
     *
     *  *   __'average'__: The average of the ranks that would have been assigned to
     *    all the tied values is assigned to each value.
     *  * __'min'__: The minimum of the ranks that would have been assigned to all
     *    the tied values is assigned to each value.  _This is also
     *    referred to as "competition" ranking._
     *  * __'max'__: The maximum of the ranks that would have been assigned to all
     *    the tied values is assigned to each value.
     *  * __'dense'__: Like 'min', but the rank of the next highest element is
     *    assigned the rank immediately after those assigned to the tied
     *    elements.
     *  * __'ordinal'__: All values are given a distinct rank, corresponding to
     *    the order that the values occur in `a`.
     *  * __'random'__: Like 'ordinal', but the rank for ties is not dependent
     *    on the order that the values occur in `a`.
     */
    rank(method?: RankMethod): Series;
    rechunk(): Series;
    rechunk(inPlace: true): Series;
    rechunk(inPlace: false): void;
    /**
     * __Reinterpret the underlying bits as a signed/unsigned integer.__
     *
     * This operation is only allowed for 64bit integers. For lower bits integers,
     * you can safely use that cast operation.
     * ___
     * @param signed signed or unsigned
     *
     * - True -> pl.Int64
     * - False -> pl.UInt64
     * @see {@link cast}
     *
     */
    reinterpret(signed?: boolean): Series;
    /**
     * __Rename this Series.__
     *
     * @param name - new name
     * @param inPlace - Modify the Series in-place.
     * @see {@link alias}
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s.rename('b')
     * shape: (3,)
     * Series: 'b' [i64]
     * [
     *         1
     *         2
     *         3
     * ]
     * ```
     */
    rename(name: string): Series;
    rename(name: string, inPlace: boolean): void;
    rename({ name, inPlace }: { name: string; inPlace?: boolean }): void;
    rename({ name, inPlace }: { name: string; inPlace: true }): void;

    /**
     * __Check if series is equal with another Series.__
     * @param other - Series to compare with.
     * @param nullEqual - Consider null values as equal. _('undefined' is treated as null)_
     * ___
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s2 = pl.Series("b", [4, 5, 6])
     * s.series_equal(s)
     * true
     * s.series_equal(s2)
     * false
     * ```
     */
    seriesEqual<U>(other: Series, nullEqual?: boolean, strict?: boolean): boolean;
    /**
     * __Set masked values__
     * @param filter Boolean mask
     * @param value value to replace masked values with
     */
    set(filter: Series, value: any): Series;
    setAtIdx(indices: number[] | Series, value: any): void;
    /**
     * __Shift the values by a given period__
     *
     * the parts that will be empty due to this operation will be filled with `null`.
     * ___
     * @param periods - Number of places to shift (may be negative).
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s.shift(1)
     * shape: (3,)
     * Series: 'a' [i64]
     * [
     *         null
     *         1
     *         2
     * ]
     * s.shift(-1)
     * shape: (3,)
     * Series: 'a' [i64]
     * [
     *         2
     *         3
     *         null
     * ]
     * ```
     */
    shift(periods: number): Series;
    /**
     * Shift the values by a given period
     *
     * the parts that will be empty due to this operation will be filled with `fillValue`.
     * ___
     * @param periods - Number of places to shift (may be negative).
     * @param fillValue - Fill null & undefined values with the result of this expression.
     */
    shiftAndFill(periods: number, fillValue: any): Series;
    shiftAndFill(args: { periods: number; fillValue: any }): Series;

    /**
     * __Shrink memory usage of this Series to fit the exact capacity needed to hold the data.__
     * @param inPlace - Modify the Series in-place.
     */
    shrinkToFit(): Series;
    shrinkToFit(inPlace: true): void;
    /**
     * __Compute the sample skewness of a data set.__
     *
     * For normally distributed data, the skewness should be about zero. For
     * unimodal continuous distributions, a skewness value greater than zero means
     * that there is more weight in the right tail of the distribution. The
     * function `skewtest` can be used to determine if the skewness value
     * is close enough to zero, statistically speaking.
     * ___
     * @param bias - If false, then the calculations are corrected for statistical bias.
     */
    skew(bias?: boolean): number | undefined;
    /**
     * Create subslices of the Series.
     *
     * @param offset - Start of the slice (negative indexing may be used).
     * @param length - length of the slice.
     */
    slice(start: number, length?: number): Series;
    /**
     * __Sort this Series.__
     * @param reverse - Reverse sort
     * @example
     * ```
     * s = pl.Series("a", [1, 3, 4, 2])
     * s.sort()
     * shape: (4,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     *         4
     * ]
     * s.sort(true)
     * shape: (4,)
     * Series: 'a' [i64]
     * [
     *         4
     *         3
     *         2
     *         1
     * ]
     * ```
     */
    sort(): Series;
    sort(reverse?: boolean): Series;
    sort(options: { reverse: boolean }): Series;
    /**
     * Reduce this Series to the sum value.
     * @example
     * ```
     * > s = pl.Series("a", [1, 2, 3])
     * > s.sum()
     * 6
     * ```
     */
    sum(): number;
    /**
     * __Get last N elements as Series.__
     *
     * ___
     * @param length - Length of the tail
     * @see {@link head}
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3])
     * s.tail(2)
     * shape: (2,)
     * Series: 'a' [i64]
     * [
     *         2
     *         3
     * ]
     * ```
     */
    tail(length?: number): Series;
    /**
     * Take every nth value in the Series and return as new Series.
     * @param n - nth value to take
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3, 4])
     * s.takeEvery(2))
     * shape: (2,)
     * Series: '' [i64]
     * [
     *         1
     *         3
     * ]
     * ```
     */
    takeEvery(n: number): Series;
    /**
     * Take values by index.
     * ___
     * @param indices - Index location used for the selection
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 3, 4])
     * s.take([1, 3])
     * shape: (2,)
     * Series: 'a' [i64]
     * [
     *         2
     *         4
     * ]
     * ```
     */
    take(indices: Array<number>): Series;

    /**
     * __Get unique elements in series.__
     * ___
     * @param maintainOrder Maintain order of data. This requires more work.
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 2, 3])
     * s.unique()
     * shape: (3,)
     * Series: 'a' [i64]
     * [
     *         1
     *         2
     *         3
     * ]
     * ```
     */
    unique(maintainOrder?: boolean | { maintainOrder: boolean }): Series;
    /**
     * __Count the unique values in a Series.__
     * ___
     * @example
     * ```
     * s = pl.Series("a", [1, 2, 2, 3])
     * s.valueCounts()
     * shape: (3, 2)
     * ╭─────┬────────╮
     * │ a   ┆ counts │
     * │ --- ┆ ---    │
     * │ i64 ┆ u32    │
     * ╞═════╪════════╡
     * │ 2   ┆ 2      │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     * │ 1   ┆ 1      │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     * │ 3   ┆ 1      │
     * ╰─────┴────────╯
     * ```
     */
    valueCounts(): DataFrame;
    /**
     * Where mask evaluates true, take values from self.
     *
     * Where mask evaluates false, take values from other.
     * ___
     * @param mask - Boolean Series
     * @param other - Series of same type
     *
     */
    zipWith(mask: Series, other: Series): Series;

    /**
     * __Convert this Series to a Javascript Array.__
     *
     * This operation clones data, and is very slow, but maintains greater precision for all dtypes.
     * Often times `series.toObject().values` is faster, but less precise
     * ___
     * @example
     * ```
     * const s = pl.Series("a", [1, 2, 3])
     * const arr = s.toArray()
     * [1, 2, 3]
     * Array.isArray(arr)
     * true
     * ```
     */
    toArray(): Array<any>;
    /**
     * Converts series to a javascript typedArray.
     *
     * __Warning:__
     * This will throw an error if you have nulls, or are using non numeric data types
     */
    toTypedArray(): any;

    /**
     * _Returns a Javascript object representation of Series_
     * Often this is much faster than the iterator, or `values` method
     *
     * @example
     * ```
     * const s = pl.Series("foo", [1,2,3])
     * s.toObject()
     * {
     *   name: "foo",
     *   datatype: "Float64",
     *   values: [1,2,3]
     * }
     * ```
     */
    toObject(): { name: string; datatype: string; values: any[] };
    toFrame(): DataFrame;
    /** compat with `JSON.stringify */
    toJSON(): string;
    /** Returns an iterator over the values */
    values(): IterableIterator<any>;
}


/**
 * @ignore
 * @inheritDoc {Series}
 */
export interface SeriesConstructor extends Deserialize<Series> {
    /**
     * Creates a new Series from a set of values.
     * @param values — A set of values to include in the new Series object.
     * @example
     * ```
     * >  pl.Series([1, 2, 3])
     * shape: (3,)
     * Series: '' [f64]
     * [
     *         1
     *         2
     *         3
     * ]
     * ```
     */
    (values: any): Series;
    /**
     * Create a new named series
     * @param name - The name of the series
     * @param values - A set of values to include in the new Series object.
     * @example
     * ```
     * >  pl.Series('foo', [1, 2, 3])
     * shape: (3,)
     * Series: 'foo' [f64]
     * [
     *         1
     *         2
     *         3
     * ]
     * ```
     */
    (name: string, values: any[], dtype?): Series;

    /**
     * Creates an array from an array-like object.
     * @param arrayLike — An array-like object to convert to an array.
     */
    from<T>(arrayLike: ArrayLike<T>): Series;
    from<T>(name: string, arrayLike: ArrayLike<T>): Series;
    /**
     * Returns a new Series from a set of elements.
     * @param items — A set of elements to include in the new Series object.
     */
    of<T>(...items: T[]): Series;
    isSeries(arg: any): arg is Series;
    /**
     * @param binary used to serialize/deserialize series. This will only work with the output from series.toBinary().
     */
    // fromBinary(binary: Buffer): Series
}

/**
 * namespace containing series string functions
 */
export interface StringNamespace extends StringFunctions<Series> {
    /**
     * Vertically concat the values in the Series to a single string value.
     * @example
     * ```
     * > pl.Series([1, null, 2]).str.concat("-")[0]
     * '1-null-2'
     * ```
     */
    concat(delimiter: string): Series;
    /**
     * Check if strings in Series contain regex pattern.
     * @param pattern A valid regex pattern
     * @returns Boolean mask
     */
    contains(pattern: string | RegExp): Series;
    /**
     * Decodes a value using the provided encoding
     * @param encoding - hex | base64
     * @param strict - how to handle invalid inputs
     *
     *     - true: method will throw error if unable to decode a value
     *     - false: unhandled values will be replaced with `null`
     * @example
     * ```
     * s = pl.Series("strings", ["666f6f", "626172", null])
     * s.str.decode("hex")
     * shape: (3,)
     * Series: 'strings' [str]
     * [
     *     "foo",
     *     "bar",
     *     null
     * ]
     * ```
     */
    decode(encoding: "hex" | "base64", strict?: boolean): Series;
    decode(options: { encoding: "hex" | "base64"; strict?: boolean }): Series;
    /**
     * Encodes a value using the provided encoding
     * @param encoding - hex | base64
     * @example
     * ```
     * s = pl.Series("strings", ["foo", "bar", null])
     * s.str.encode("hex")
     * shape: (3,)
     * Series: 'strings' [str]
     * [
     *     "666f6f",
     *     "626172",
     *     null
     * ]
     * ```
     */
    encode(encoding: "hex" | "base64"): Series;
    /**
     * Extract the target capture group from provided patterns.
     * @param pattern A valid regex pattern
     * @param groupIndex Index of the targeted capture group.
     * Group 0 mean the whole pattern, first group begin at index 1
     * Default to the first capture group
     * @returns Utf8 array. Contain null if original value is null or regex capture nothing.
     * @example
     * ```
     * >  df = pl.DataFrame({
     * ...   'a': [
     * ...       'http://vote.com/ballon_dor?candidate=messi&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidat=jorginho&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidate=ronaldo&ref=polars'
     * ...   ]})
     * >  df.getColumn("a").str.extract(/candidate=(\w+)/, 1)
     * shape: (3, 1)
     * ┌─────────┐
     * │ a       │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ messi   │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ ronaldo │
     * └─────────┘
     * ```
     */
    extract(pattern: string | RegExp, groupIndex: number): Series;
    /***
     * Parse string values as JSON.
     * @returns Utf8 array. Contain null if original value is null or the `jsonPath` return nothing.
     * @example
     * s = pl.Series("json", ['{"a":1, "b": true}', null, '{"a":2, "b": false}']);
     * s.str.json_extract().as("json");
     * shape: (3,)
     * Series: 'json' [struct[2]]
     * [
     *     {1,true}
     *     {null,null}
     *     {2,false}
     * ]
     */
    jsonExtract(dtype?: DataType, inferSchemaLength?: number): Series;
    /**
     * Extract the first match of json string with provided JSONPath expression.
     * Throw errors if encounter invalid json strings.
     * All return value will be casted to Utf8 regardless of the original value.
     * @see https://goessner.net/articles/JsonPath/
     * @param jsonPath - A valid JSON path query string
     * @param dtype - The dtype to cast the extracted value to. If None, the dtype will be inferred from the JSON value.
     * @param inferSchemaLength - How many rows to parse to determine the schema. If ``None`` all rows are used.
     * @returns Utf8 array. Contain null if original value is null or the `jsonPath` return nothing.
     * @example
     * ```
     * > s = pl.Series('json_val', [
     * ...   '{"a":"1"}',
     * ...   null,
     * ...   '{"a":2}',
     * ...   '{"a":2.1}',
     * ...   '{"a":true}'
     * ... ])
     * > s.str.jsonPathMatch('$.a')
     * shape: (5,)
     * Series: 'json_val' [str]
     * [
     *     "1"
     *     null
     *     "2"
     *     "2.1"
     *     "true"
     * ]
     * ```
     */
    jsonPathMatch(jsonPath: string): Series;
    /**  Get length of the string values in the Series. */
    lengths(): Series;
    /** Remove leading whitespace. */
    lstrip(): Series;
    /**
     *  Add a leading fillChar to a string until string length is reached.
     * If string is longer or equal to given length no modifications will be done
     * @param {number} length  - of the final string
     * @param {string} fillChar  - that will fill the string.
     * @note If a string longer than 1 character is provided only the first character will be used
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'foo': [
     * ...       "a",
     * ...       "b",
     * ...       "LONG_WORD",
     * ...       "cow"
     * ...   ]})
     * > df.select(pl.col('foo').str.padStart("_", 3)
     * shape: (4, 1)
     * ┌──────────┐
     * │ a        │
     * │ -------- │
     * │ str      │
     * ╞══════════╡
     * │ __a      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ __b      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ LONG_WORD│
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ cow      │
     * └──────────┘
     * ```
     */
    padStart(length: number, fillChar: string): Series;
    /**
     *  Add a leading '0' to a string until string length is reached.
     * If string is longer or equal to given length no modifications will be done
     * @param {number} length  - of the final string
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'foo': [
     * ...       "a",
     * ...       "b",
     * ...       "LONG_WORD",
     * ...       "cow"
     * ...   ]})
     * > df.select(pl.col('foo').str.padStart(3)
     * shape: (4, 1)
     * ┌──────────┐
     * │ a        │
     * │ -------- │
     * │ str      │
     * ╞══════════╡
     * │ 00a      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ 00b      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ LONG_WORD│
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ cow      │
     * └──────────┘
     * ```
     */
    zFill(length: number): Series;
    /** Add trailing zeros */
    padEnd(length: number, fillChar: string): Series;
    /**
     * Replace first regex match with a string value.
     * @param pattern A valid regex pattern
     * @param value Substring to replace.
     */
    replace(pattern: string | RegExp, value: string): Series;

    /**
     * Replace all regex matches with a string value.
     * @param pattern - A valid regex pattern
     * @param value Substring to replace.
     */
    replaceAll(pattern: string | RegExp, value: string): Series;
    /** Modify the strings to their lowercase equivalent. */
    toLowerCase(): Series;
    /** Modify the strings to their uppercase equivalent. */
    toUpperCase(): Series;
    /** Remove trailing whitespace. */
    rstrip(): Series;
    /** Remove leading and trailing whitespace. */
    strip(): Series;
    /**
     * Create subslices of the string values of a Utf8 Series.
     * @param start - Start of the slice (negative indexing may be used).
     * @param length - Optional length of the slice.
     */
    slice(start: number, length?: number): Series;
    /**
     * Split a string into substrings using the specified separator.
     * The return type will by of type List<Utf8>
     * @param separator — A string that identifies character or characters to use in separating the string.
     * @param inclusive Include the split character/string in the results
     */
    split(separator: string, options?: { inclusive?: boolean } | boolean): Series;
    /**
     * Parse a Series of dtype Utf8 to a Date/Datetime Series.
     * @param datatype Date or Datetime.
     * @param fmt formatting syntax. [Read more](https://docs.rs/chrono/0.4.19/chrono/format/strptime/index.html)
     */
    strptime(datatype: DataType.Date, fmt?: string): Series;
    strptime(datatype: DataType.Datetime, fmt?: string): Series;
}
