/** namespace containing expr list functions */
export type ExprList = ListFunctions<Expr>;


export interface ExprConstructor extends Deserialize<Expr> {
    isExpr(arg: any): arg is Expr;
}


export interface ExprStruct {
    /**
     * Access a field by name
     * @param name - name of the field
     */
    field(name: string): Expr;
    /**
     * Rename the fields of a struct
     * @param names - new names of the fields
     */
    renameFields(names: string[]): Expr;
}

/**
 * namespace containing expr string functions
 */
export interface StringNamespace extends StringFunctions<Expr> {
    /**
     * Vertically concat the values in the Series to a single string value.
     * @example
     * ```
     * >>> df = pl.DataFrame({"foo": [1, null, 2]})
     * >>> df = df.select(pl.col("foo").str.concat("-"))
     * >>> df
     * shape: (1, 1)
     * ┌──────────┐
     * │ foo      │
     * │ ---      │
     * │ str      │
     * ╞══════════╡
     * │ 1-null-2 │
     * └──────────┘
     * ```
     */
    concat(delimiter: string): Expr;
    /** Check if strings in Series contain regex pattern. */
    contains(pat: string | RegExp): Expr;
    /**
     * Decodes a value using the provided encoding
     * @param encoding - hex | base64
     * @param strict - how to handle invalid inputs
     *
     *     - true: method will throw error if unable to decode a value
     *     - false: unhandled values will be replaced with `null`
     * @example
     * ```
     * >>> df = pl.DataFrame({"strings": ["666f6f", "626172", null]})
     * >>> df.select(col("strings").str.decode("hex"))
     * shape: (3, 1)
     * ┌─────────┐
     * │ strings │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ foo     │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ bar     │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * └─────────┘
     * ```
     */
    decode(encoding: "hex" | "base64", strict?: boolean): Expr;
    decode(options: { encoding: "hex" | "base64"; strict?: boolean }): Expr;
    /**
     * Encodes a value using the provided encoding
     * @param encoding - hex | base64
     * @example
     * ```
     * >>> df = pl.DataFrame({"strings", ["foo", "bar", null]})
     * >>> df.select(col("strings").str.encode("hex"))
     * shape: (3, 1)
     * ┌─────────┐
     * │ strings │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ 666f6f  │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ 626172  │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * └─────────┘
     * ```
     */
    encode(encoding: "hex" | "base64"): Expr;
    /**
     * Extract the target capture group from provided patterns.
     * @param pattern A valid regex pattern
     * @param groupIndex Index of the targeted capture group.
     * Group 0 mean the whole pattern, first group begin at index 1
     * Default to the first capture group
     * @returns Utf8 array. Contain null if original value is null or regex capture nothing.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'a': [
     * ...       'http://vote.com/ballon_dor?candidate=messi&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidat=jorginho&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidate=ronaldo&ref=polars'
     * ...   ]})
     * > df.select(pl.col('a').str.extract(/candidate=(\w+)/, 1))
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
    extract(pat: string | RegExp, groupIndex: number): Expr;

    /**
    * Parse string values as JSON.
    * Throw errors if encounter invalid JSON strings.
    * @params Not implemented ATM
    * @returns DF with struct
    * @example
  
    * >>> df = pl.DataFrame( {json: ['{"a":1, "b": true}', null, '{"a":2, "b": false}']} )
    * >>> df.select(pl.col("json").str.jsonExtract())
    * shape: (3, 1)
    * ┌─────────────┐
    * │ json        │
    * │ ---         │
    * │ struct[2]   │
    * ╞═════════════╡
    * │ {1,true}    │
    * │ {null,null} │
    * │ {2,false}   │
    * └─────────────┘
    * See Also
    * ----------
    * jsonPathMatch : Extract the first match of json string with provided JSONPath expression.
    */
    jsonExtract(dtype?: DataType, inferSchemaLength?: number): Expr;
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
     * >>> df = pl.DataFrame({
     * ...   'json_val': [
     * ...     '{"a":"1"}',
     * ...     null,
     * ...     '{"a":2}',
     * ...     '{"a":2.1}',
     * ...     '{"a":true}'
     * ...   ]
     * ... })
     * >>> df.select(pl.col('json_val').str.jsonPathMatch('$.a')
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
    jsonPathMatch(pat: string): Expr;
    /**  Get length of the string values in the Series. */
    lengths(): Expr;
    /** Remove leading whitespace. */
    lstrip(): Expr;
    /** Replace first regex match with a string value. */
    replace(pat: string | RegExp, val: string): Expr;
    /** Replace all regex matches with a string value. */
    replaceAll(pat: string | RegExp, val: string): Expr;
    /** Modify the strings to their lowercase equivalent. */
    toLowerCase(): Expr;
    /** Modify the strings to their uppercase equivalent. */
    toUpperCase(): Expr;
    /** Remove trailing whitespace. */
    rstrip(): Expr;
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
    padStart(length: number, fillChar: string): Expr;
    /**
     *  Add  leading "0" to a string until string length is reached.
     * If string is longer or equal to given length no modifications will be done
     * @param {number} length  - of the final string
     * @see {@link padStart}
     *    * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'foo': [
     * ...       "a",
     * ...       "b",
     * ...       "LONG_WORD",
     * ...       "cow"
     * ...   ]})
     * > df.select(pl.col('foo').str.justify(3)
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
    zFill(length: number): Expr;
    /**
     *  Add a trailing fillChar to a string until string length is reached.
     * If string is longer or equal to given length no modifications will be done
     * @param {number} length  - of the final string
     * @param {string} fillChar  - that will fill the string.
     * @note If a string longer than 1 character is provided only the first character will be used
     *    * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'foo': [
     * ...       "a",
     * ...       "b",
     * ...       "LONG_WORD",
     * ...       "cow"
     * ...   ]})
     * > df.select(pl.col('foo').str.padEnd("_", 3)
     * shape: (4, 1)
     * ┌──────────┐
     * │ a        │
     * │ -------- │
     * │ str      │
     * ╞══════════╡
     * │ a__      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ b__      │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ LONG_WORD│
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ cow      │
     * └──────────┘
     * ```
     */
    padEnd(length: number, fillChar: string): Expr;
    /**
     * Create subslices of the string values of a Utf8 Series.
     * @param start - Start of the slice (negative indexing may be used).
     * @param length - Optional length of the slice.
     */
    slice(start: number, length?: number): Expr;
    /**
     * Split a string into substrings using the specified separator and return them as a Series.
     * @param separator — A string that identifies character or characters to use in separating the string.
     * @param inclusive Include the split character/string in the results
     */
    split(by: string, options?: { inclusive?: boolean } | boolean): Expr;
    /** Remove leading and trailing whitespace. */
    strip(): Expr;
    /**
     * Parse a Series of dtype Utf8 to a Date/Datetime Series.
     * @param datatype Date or Datetime.
     * @param fmt formatting syntax. [Read more](https://docs.rs/chrono/0.4.19/chrono/format/strftime/index.html)
     */
    strptime(datatype: DataType.Date, fmt?: string): Expr;
    strptime(datatype: DataType.Datetime, fmt?: string): Expr;
}

/** Expressions that can be used in various contexts. */
export interface Expr extends Rolling<Expr>, Arithmetic<Expr>, Comparison<Expr>, Cumulative<Expr>, Sample<Expr>, Round<Expr>, Serialize {

    /** @ignore */
    _expr: any;

    /** Datetime namespace */
    get date(): dt.ExprDateTime;

    /**
     * String namespace
     */
    get str(): str.StringNamespace;
    /**
     * List namespace
     */
    get lst(): lst.ExprList;
    /**
     * Struct namespace
     */
    get struct(): struct.ExprStruct;
    [Symbol.toStringTag](): string;
    [INSPECT_SYMBOL](): string;
    toString(): string;
    /** compat with `JSON.stringify` */
    toJSON(): string;
    /** Take absolute values */
    abs(): Expr;
    aggGroups(): Expr;
    /**
     * Rename the output of an expression.
     * @param name new name
     * @see {@link Expr.as}
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "a": [1, 2, 3],
     * ...   "b": ["a", "b", None],
     * ... })
     * > df
     * shape: (3, 2)
     * ╭─────┬──────╮
     * │ a   ┆ b    │
     * │ --- ┆ ---  │
     * │ i64 ┆ str  │
     * ╞═════╪══════╡
     * │ 1   ┆ "a"  │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 2   ┆ "b"  │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 3   ┆ null │
     * ╰─────┴──────╯
     * > df.select([
     * ...   pl.col("a").alias("bar"),
     * ...   pl.col("b").alias("foo"),
     * ... ])
     * shape: (3, 2)
     * ╭─────┬──────╮
     * │ bar ┆ foo  │
     * │ --- ┆ ---  │
     * │ i64 ┆ str  │
     * ╞═════╪══════╡
     * │ 1   ┆ "a"  │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 2   ┆ "b"  │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 3   ┆ null │
     * ╰─────┴──────╯
     *```
     */
    alias(name: string): Expr;
    and(other: any): Expr;
    /** Get the index of the maximal value. */
    argMax(): Expr;
    /** Get the index of the minimal value. */
    argMin(): Expr;
    /**
     * Get the index values that would sort this column.
     * @param reverse
     *     - false -> order from small to large.
     *     - true -> order from large to small.
     * @returns UInt32 Series
     */
    argSort(reverse?: boolean, maintain_order?: boolean): Expr;
    argSort({
        reverse,
        maintain_order,
    }: { reverse?: boolean; maintain_order?: boolean }): Expr;
    /** Get index of first unique value. */
    argUnique(): Expr;
    /** @see {@link Expr.alias} */
    as(name: string): Expr;
    /** Fill missing values with the next to be seen values */
    backwardFill(): Expr;
    /** Cast between data types. */
    cast(dtype: DataType, strict?: boolean): Expr;
    /** Count the number of values in this expression */
    count(): Expr;
    /** Calculate the n-th discrete difference.
     *
     * @param n number of slots to shift
     * @param nullBehavior ignore or drop
     */
    diff(n: number, nullBehavior: "ignore" | "drop"): Expr;
    diff(o: { n: number; nullBehavior: "ignore" | "drop" }): Expr;
    /**
     * Compute the dot/inner product between two Expressions
     * @param other Expression to compute dot product with
     */
    dot(other: any): Expr;
    /**
     * Exclude certain columns from a wildcard/regex selection.
     *
     * You may also use regexes in the exclude list. They must start with `^` and end with `$`.
     *
     * @param columns Column(s) to exclude from selection
     * @example
     * ```
     *  >df = pl.DataFrame({
     *  ...   "a": [1, 2, 3],
     *  ...   "b": ["a", "b", None],
     *  ...   "c": [None, 2, 1],
     *  ...})
     *  >df
     *  shape: (3, 3)
     *  ╭─────┬──────┬──────╮
     *  │ a   ┆ b    ┆ c    │
     *  │ --- ┆ ---  ┆ ---  │
     *  │ i64 ┆ str  ┆ i64  │
     *  ╞═════╪══════╪══════╡
     *  │ 1   ┆ "a"  ┆ null │
     *  ├╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     *  │ 2   ┆ "b"  ┆ 2    │
     *  ├╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     *  │ 3   ┆ null ┆ 1    │
     *  ╰─────┴──────┴──────╯
     *  >df.select(
     *  ...   pl.col("*").exclude("b"),
     *  ... )
     * shape: (3, 2)
     * ╭─────┬──────╮
     * │ a   ┆ c    │
     * │ --- ┆ ---  │
     * │ i64 ┆ i64  │
     * ╞═════╪══════╡
     * │ 1   ┆ null │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 2   ┆ 2    │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 3   ┆ 1    │
     * ╰─────┴──────╯
     * ```
     */
    exclude(column: string, ...columns: string[]): Expr;
    /**
     * Explode a list or utf8 Series.
     *
     * This means that every item is expanded to a new row.
     */
    explode(): Expr;
    /**
     * Extend the Series with given number of values.
     * @param value The value to extend the Series with. This value may be null to fill with nulls.
     * @param n The number of values to extend.
     * @deprecated
     * @see {@link extendConstant}
     */
    extend(value: any, n: number): Expr;
    extend(opt: { value: any; n: number }): Expr;
    /**
     * Extend the Series with given number of values.
     * @param value The value to extend the Series with. This value may be null to fill with nulls.
     * @param n The number of values to extend.
     */
    extendConstant(value: any, n: number): Expr;
    extendConstant(opt: { value: any; n: number }): Expr;
    /** Fill nan value with a fill value */
    fillNan(other: any): Expr;
    /** Fill null value with a fill value or strategy */
    fillNull(other: any | FillNullStrategy): Expr;
    /**
     * Filter a single column.
     *
     * Mostly useful in in aggregation context.
     * If you want to filter on a DataFrame level, use `LazyFrame.filter`.
     * @param predicate Boolean expression.
     */
    filter(predicate: Expr): Expr;
    /** Get the first value. */
    first(): Expr;
    /** @see {@link Expr.explode} */
    flatten(): Expr;
    /** Fill missing values with the latest seen values */
    forwardFill(): Expr;
    /** Hash the Series. */
    hash(k0?: number, k1?: number, k2?: number, k3?: number): Expr;
    hash({
        k0,
        k1,
        k2,
        k3,
    }: { k0?: number; k1?: number; k2?: number; k3?: number }): Expr;
    /** Take the first n values.  */
    head(length?: number): Expr;
    head({ length }: { length: number }): Expr;
    inner(): any;
    /** Interpolate intermediate values. The interpolation method is linear. */
    interpolate(): Expr;
    /** Get mask of duplicated values. */
    isDuplicated(): Expr;
    /** Create a boolean expression returning `true` where the expression values are finite. */
    isFinite(): Expr;
    /** Get a mask of the first unique value. */
    isFirst(): Expr;
    /**
     * Check if elements of this Series are in the right Series, or List values of the right Series.
     *
     * @param other Series of primitive type or List type.
     * @returns Expr that evaluates to a Boolean Series.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "sets": [[1, 2, 3], [1, 2], [9, 10]],
     * ...    "optional_members": [1, 2, 3]
     * ... })
     * > df.select(
     * ...   pl.col("optional_members").isIn("sets").alias("contains")
     * ... )
     * shape: (3, 1)
     * ┌──────────┐
     * │ contains │
     * │ ---      │
     * │ bool     │
     * ╞══════════╡
     * │ true     │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ true     │
     * ├╌╌╌╌╌╌╌╌╌╌┤
     * │ false    │
     * └──────────┘
     * ```
     */
    isIn(other): Expr;
    /** Create a boolean expression returning `true` where the expression values are infinite. */
    isInfinite(): Expr;
    /** Create a boolean expression returning `true` where the expression values are NaN (Not A Number). */
    isNan(): Expr;
    /** Create a boolean expression returning `true` where the expression values are not NaN (Not A Number). */
    isNotNan(): Expr;
    /** Create a boolean expression returning `true` where the expression does not contain null values. */
    isNotNull(): Expr;
    /** Create a boolean expression returning `True` where the expression contains null values. */
    isNull(): Expr;
    /** Get mask of unique values. */
    isUnique(): Expr;
    /**
     *  Keep the original root name of the expression.
     *
     * A groupby aggregation often changes the name of a column.
     * With `keepName` we can keep the original name of the column
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "a": [1, 2, 3],
     * ...   "b": ["a", "b", None],
     * ... })
     *
     * > df
     * ...   .groupBy("a")
     * ...   .agg(pl.col("b").list())
     * ...   .sort({by:"a"})
     *
     * shape: (3, 2)
     * ╭─────┬────────────╮
     * │ a   ┆ b_agg_list │
     * │ --- ┆ ---        │
     * │ i64 ┆ list [str] │
     * ╞═════╪════════════╡
     * │ 1   ┆ [a]        │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 2   ┆ [b]        │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 3   ┆ [null]     │
     * ╰─────┴────────────╯
     *
     * Keep the original column name:
     *
     * > df
     * ...   .groupby("a")
     * ...   .agg(col("b").list().keepName())
     * ...   .sort({by:"a"})
     *
     * shape: (3, 2)
     * ╭─────┬────────────╮
     * │ a   ┆ b          │
     * │ --- ┆ ---        │
     * │ i64 ┆ list [str] │
     * ╞═════╪════════════╡
     * │ 1   ┆ [a]        │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 2   ┆ [b]        │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 3   ┆ [null]     │
     * ╰─────┴────────────╯
     * ```
     */
    keepName(): Expr;
    kurtosis(): Expr;
    kurtosis(fisher: boolean, bias?: boolean): Expr;
    kurtosis({ fisher, bias }: { fisher?: boolean; bias?: boolean }): Expr;
    /** Get the last value.  */
    last(): Expr;
    /** Aggregate to list. */
    list(): Expr;
    /** Returns a unit Series with the lowest value possible for the dtype of this expression. */
    lowerBound(): Expr;
    /** Compute the max value of the arrays in the list */
    max(): Expr;
    /** Compute the mean value of the arrays in the list */
    mean(): Expr;
    /** Get median value. */
    median(): Expr;
    /** Get minimum value. */
    min(): Expr;
    /** Compute the most occurring value(s). Can return multiple Values */
    mode(): Expr;
    /** Negate a boolean expression. */
    not(): Expr;
    /** Count unique values. */
    nUnique(): Expr;
    or(other: any): Expr;
    /**
     * Apply window function over a subgroup.
     *
     * This is similar to a groupby + aggregation + self join.
     * Or similar to [window functions in Postgres](https://www.postgresql.org/docs/9.1/tutorial-window.html)
     * @param partitionBy Column(s) to partition by.
     *
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...  "groups": [1, 1, 2, 2, 1, 2, 3, 3, 1],
     * ...  "values": [1, 2, 3, 4, 5, 6, 7, 8, 8],
     * ... })
     * > df.select(
     * ...     pl.col("groups").sum().over("groups")
     * ... )
     *     ╭────────┬────────╮
     *     │ groups ┆ values │
     *     │ ---    ┆ ---    │
     *     │ i32    ┆ i32    │
     *     ╞════════╪════════╡
     *     │ 1      ┆ 16     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 1      ┆ 16     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 2      ┆ 13     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 2      ┆ 13     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ ...    ┆ ...    │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 1      ┆ 16     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 2      ┆ 13     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 3      ┆ 15     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 3      ┆ 15     │
     *     ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌┤
     *     │ 1      ┆ 16     │
     *     ╰────────┴────────╯
     * ```
     */
    over(by: ExprOrString, ...partitionBy: ExprOrString[]): Expr;
    /** Raise expression to the power of exponent. */
    pow(exponent: number): Expr;
    pow({ exponent }: { exponent: number }): Expr;
    /**
     * Add a prefix the to root column name of the expression.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "A": [1, 2, 3, 4, 5],
     * ...   "fruits": ["banana", "banana", "apple", "apple", "banana"],
     * ...   "B": [5, 4, 3, 2, 1],
     * ...   "cars": ["beetle", "audi", "beetle", "beetle", "beetle"],
     * ... })
     * shape: (5, 4)
     * ╭─────┬──────────┬─────┬──────────╮
     * │ A   ┆ fruits   ┆ B   ┆ cars     │
     * │ --- ┆ ---      ┆ --- ┆ ---      │
     * │ i64 ┆ str      ┆ i64 ┆ str      │
     * ╞═════╪══════════╪═════╪══════════╡
     * │ 1   ┆ "banana" ┆ 5   ┆ "beetle" │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┤
     * │ 2   ┆ "banana" ┆ 4   ┆ "audi"   │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┤
     * │ 3   ┆ "apple"  ┆ 3   ┆ "beetle" │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┤
     * │ 4   ┆ "apple"  ┆ 2   ┆ "beetle" │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┤
     * │ 5   ┆ "banana" ┆ 1   ┆ "beetle" │
     * ╰─────┴──────────┴─────┴──────────╯
     * > df.select(
     * ...   pl.all().reverse().prefix("reverse_"),
     * ... )
     * shape: (5, 8)
     * ╭───────────┬────────────────┬───────────┬──────────────╮
     * │ reverse_A ┆ reverse_fruits ┆ reverse_B ┆ reverse_cars │
     * │ ---       ┆ ---            ┆ ---       ┆ ---          │
     * │ i64       ┆ str            ┆ i64       ┆ str          │
     * ╞═══════════╪════════════════╪═══════════╪══════════════╡
     * │ 5         ┆ "banana"       ┆ 1         ┆ "beetle"     │
     * ├╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 4         ┆ "apple"        ┆ 2         ┆ "beetle"     │
     * ├╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 3         ┆ "apple"        ┆ 3         ┆ "beetle"     │
     * ├╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 2         ┆ "banana"       ┆ 4         ┆ "audi"       │
     * ├╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 1         ┆ "banana"       ┆ 5         ┆ "beetle"     │
     * ╰───────────┴────────────────┴───────────┴──────────────╯
     * ```
     */
    prefix(prefix: string): Expr;
    /** Get quantile value. */
    quantile(quantile: number | Expr): Expr;
    /** Assign ranks to data, dealing with ties appropriately. */
    rank(method?: RankMethod): Expr;
    rank({ method }: { method: string }): Expr;
    reinterpret(signed?: boolean): Expr;
    reinterpret({ signed }: { signed: boolean }): Expr;
    /**
     * Repeat the elements in this Series `n` times by dictated by the number given by `by`.
     * The elements are expanded into a `List`
     * @param by Numeric column that determines how often the values will be repeated.
     *
     * The column will be coerced to UInt32. Give this dtype to make the coercion a no-op.
     */
    repeatBy(by: Expr | string): Expr;
    /** Reverse the arrays in the list */
    reverse(): Expr;
    /**
     * Shift the values by a given period and fill the parts that will be empty due to this operation
     * @param periods number of places to shift (may be negative).
     */
    shift(periods?: number): Expr;
    shift({ periods }: { periods: number }): Expr;
    /**
     * Shift the values by a given period and fill the parts that will be empty due to this operation
     * @param periods Number of places to shift (may be negative).
     * @param fillValue Fill null values with the result of this expression.
     */
    shiftAndFill(periods: number, fillValue: Expr): Expr;
    shiftAndFill({
        periods,
        fillValue,
    }: { periods: number; fillValue: Expr }): Expr;
    /**
     * Compute the sample skewness of a data set.
     * For normally distributed data, the skewness should be about zero. For
     * unimodal continuous distributions, a skewness value greater than zero means
     * that there is more weight in the right tail of the distribution.
     * ___
     * @param bias If False, then the calculations are corrected for statistical bias.
     */
    skew(bias?: boolean): Expr;
    skew({ bias }: { bias: boolean }): Expr;
    /** Slice the Series. */
    slice(offset: number | Expr, length: number | Expr): Expr;
    slice({
        offset,
        length,
    }: { offset: number | Expr; length: number | Expr }): Expr;
    /**
     * Sort this column. In projection/ selection context the whole column is sorted.
     * @param reverse
     * * false -> order from small to large.
     * * true -> order from large to small.
     * @param nullsLast If true nulls are considered to be larger than any valid value
     */
    sort(reverse?: boolean, nullsLast?: boolean): Expr;
    sort({
        reverse,
        nullsLast,
    }: { reverse?: boolean; nullsLast?: boolean }): Expr;
    /**
     * Sort this column by the ordering of another column, or multiple other columns.
        In projection/ selection context the whole column is sorted.
        If used in a groupby context, the groups are sorted.
  
        Parameters
        ----------
        @param by
            The column(s) used for sorting.
        @param reverse
            false -> order from small to large.
            true -> order from large to small.
     */
    sortBy(
        by: ExprOrString[] | ExprOrString,
        reverse?: boolean | boolean[],
    ): Expr;
    sortBy(options: {
        by: ExprOrString[] | ExprOrString;
        reverse?: boolean | boolean[];
    }): Expr;
    /** Get standard deviation. */
    std(): Expr;
    /** Add a suffix the to root column name of the expression. */
    suffix(suffix: string): Expr;
    /**
     * Get sum value.
     * @note
     * Dtypes in {Int8, UInt8, Int16, UInt16} are cast to Int64 before summing to prevent overflow issues.
     */
    sum(): Expr;
    /** Take the last n values. */
    tail(length?: number): Expr;
    tail({ length }: { length: number }): Expr;
    /**
     * Take values by index.
     * @param index An expression that leads to a UInt32 dtyped Series.
     */
    take(index: Expr | number[] | Series): Expr;
    take({ index }: { index: Expr | number[] | Series }): Expr;
    /** Take every nth value in the Series and return as a new Series. */
    takeEvery(n: number): Expr;
    /**
     * Get the unique values of this expression;
     * @param maintainOrder Maintain order of data. This requires more work.
     */
    unique(maintainOrder?: boolean | { maintainOrder: boolean }): Expr;
    /** Returns a unit Series with the highest value possible for the dtype of this expression. */
    upperBound(): Expr;
    /** Get variance. */
    var(): Expr;
    /** Alias for filter: @see {@link filter} */
    where(predicate: Expr): Expr;
}










