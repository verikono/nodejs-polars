export interface WriteMethods {
    /**
     * __Write DataFrame to comma-separated values file (csv).__
     *
     * If no options are specified, it will return a new string containing the contents
     * ___
     * @param dest file or stream to write to
     * @param options
     * @param options.hasHeader - Whether or not to include header in the CSV output.
     * @param options.sep - Separate CSV fields with this symbol. _defaults to `,`_
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.writeCSV()
     * foo,bar,ham
     * 1,6,a
     * 2,7,b
     * 3,8,c
     *
     * // using a file path
     * > df.head(1).writeCSV("./foo.csv")
     * // foo.csv
     * foo,bar,ham
     * 1,6,a
     *
     * // using a write stream
     * > const writeStream = new Stream.Writable({
     * ...   write(chunk, encoding, callback) {
     * ...     console.log("writeStream: %O', chunk.toString());
     * ...     callback(null);
     * ...   }
     * ... });
     * > df.head(1).writeCSV(writeStream, {hasHeader: false})
     * writeStream: '1,6,a'
     * ```
     * @category IO
     */
    writeCSV(): Buffer;
    writeCSV(options: WriteCsvOptions): Buffer;
    writeCSV(dest: string | Writable, options?: WriteCsvOptions): void;
    /**
     * Write Dataframe to JSON string, file, or write stream
     * @param destination file or write stream
     * @param options
     * @param options.format - json | lines
     * @example
     * ```
     * > const df = pl.DataFrame({
     * ...   foo: [1,2,3],
     * ...   bar: ['a','b','c']
     * ... })
     *
     *
     * > df.writeJSON({format:"json"})
     * `[ {"foo":1.0,"bar":"a"}, {"foo":2.0,"bar":"b"}, {"foo":3.0,"bar":"c"}]`
     *
     * > df.writeJSON({format:"lines"})
     * `{"foo":1.0,"bar":"a"}
     * {"foo":2.0,"bar":"b"}
     * {"foo":3.0,"bar":"c"}`
     *
     * // writing to a file
     * > df.writeJSON("/path/to/file.json", {format:'lines'})
     * ```
     * @category IO
     */
    writeJSON(options?: { format: "lines" | "json" }): Buffer;
    writeJSON(
        destination: string | Writable,
        options?: { format: "lines" | "json" },
    ): void;
    /**
     * Write to Arrow IPC binary stream, or a feather file.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeIPC(options?: WriteIPCOptions): Buffer;
    writeIPC(destination: string | Writable, options?: WriteIPCOptions): void;

    /**
     * Write the DataFrame disk in parquet format.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeParquet(options?: WriteParquetOptions): Buffer;
    writeParquet(
        destination: string | Writable,
        options?: WriteParquetOptions,
    ): void;

    /**
     * Write the DataFrame disk in avro format.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeAvro(options?: WriteAvroOptions): Buffer;
    writeAvro(destination: string | Writable, options?: WriteAvroOptions): void;
}

/**
 * DataFrame constructor
 */
export interface DataFrameConstructor extends Deserialize<DataFrame> {
    /**
     * Create an empty DataFrame
     */
    (): DataFrame;
    /**
     * Create a DataFrame from a JavaScript object
     * @example
     * ```
     * data = {'a': [1n, 2n], 'b': [3, 4]}
     * df = pl.DataFrame(data)
     * df
     * shape: (2, 2)
     * ╭─────┬─────╮
     * │ a   ┆ b   │
     * │ --- ┆ --- │
     * │ u64 ┆ i64 │
     * ╞═════╪═════╡
     * │ 1   ┆ 3   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 4   │
     * ╰─────┴─────╯
     * ```
     */
    (
        data: any,
        options?: {
            columns?: any[];
            orient?: "row" | "col";
            schema?: Record<string, string | DataType>;
            inferSchemaLength?: number;
        },
    ): DataFrame;
    isDataFrame(arg: any): arg is DataFrame;
}

/**
 * A DataFrame is a two-dimensional data structure that represents data as a table
 * with rows and columns.
 *
 * @param data -  Object, Array, or Series
 *     Two-dimensional data in various forms. object must contain Arrays.
 *     Array may contain Series or other Arrays.
 * @param columns - Array of str, default undefined
 *     Column labels to use for resulting DataFrame. If specified, overrides any
 *     labels already present in the data. Must match data dimensions.
 * @param orient - 'col' | 'row' default undefined
 *     Whether to interpret two-dimensional data as columns or as rows. If None,
 *     the orientation is inferred by matching the columns and data dimensions. If
 *     this does not yield conclusive results, column orientation is used.
 * @example
 * Constructing a DataFrame from an object :
 * ```
 * > data = {'a': [1n, 2n], 'b': [3, 4]}
 * > df = pl.DataFrame(data)
 * > df
 * shape: (2, 2)
 * ╭─────┬─────╮
 * │ a   ┆ b   │
 * │ --- ┆ --- │
 * │ u64 ┆ i64 │
 * ╞═════╪═════╡
 * │ 1   ┆ 3   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 2   ┆ 4   │
 * ╰─────┴─────╯
 * ```
 * Notice that the dtype is automatically inferred as a polars Int64:
 * ```
 * > df.dtypes
 * ['UInt64', `Int64']
 * ```
 * In order to specify dtypes for your columns, initialize the DataFrame with a list
 * of Series instead:
 * ```
 * > data = [pl.Series('col1', [1, 2], pl.Float32),
 * ...         pl.Series('col2', [3, 4], pl.Int64)]
 * > df2 = pl.DataFrame(series)
 * > df2
 * shape: (2, 2)
 * ╭──────┬──────╮
 * │ col1 ┆ col2 │
 * │ ---  ┆ ---  │
 * │ f32  ┆ i64  │
 * ╞══════╪══════╡
 * │ 1    ┆ 3    │
 * ├╌╌╌╌╌╌┼╌╌╌╌╌╌┤
 * │ 2    ┆ 4    │
 * ╰──────┴──────╯
 * ```
 *
 * Constructing a DataFrame from a list of lists, row orientation inferred:
 * ```
 * > data = [[1, 2, 3], [4, 5, 6]]
 * > df4 = pl.DataFrame(data, ['a', 'b', 'c'])
 * > df4
 * shape: (2, 3)
 * ╭─────┬─────┬─────╮
 * │ a   ┆ b   ┆ c   │
 * │ --- ┆ --- ┆ --- │
 * │ i64 ┆ i64 ┆ i64 │
 * ╞═════╪═════╪═════╡
 * │ 1   ┆ 2   ┆ 3   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 4   ┆ 5   ┆ 6   │
 * ╰─────┴─────┴─────╯
 * ```
 */
export interface DataFrame extends Arithmetic<DataFrame>,
                                    Sample<DataFrame>,
                                    Arithmetic<DataFrame>,
                                    WriteMethods,
                                    Serialize,
                                    GroupByOps<RollingGroupBy> {

    /** @ignore */
    _df: any;
    dtypes: DataType[];
    height: number;
    shape: { height: number; width: number };
    width: number;
    get columns(): string[];
    set columns(cols: string[]);
    [inspect](): string;
    [Symbol.iterator](): Generator<any, void, any>;
    /**
     * Very cheap deep clone.
     */
    clone(): DataFrame;
    /**
     * __Summary statistics for a DataFrame.__
     *
     * Only summarizes numeric datatypes at the moment and returns nulls for non numeric datatypes.
     * ___
     * Example
     * ```
     * >  df = pl.DataFrame({
     * ...      'a': [1.0, 2.8, 3.0],
     * ...      'b': [4, 5, 6],
     * ...      "c": [True, False, True]
     * ...      })
     * ...  df.describe()
     * shape: (5, 4)
     * ╭──────────┬───────┬─────┬──────╮
     * │ describe ┆ a     ┆ b   ┆ c    │
     * │ ---      ┆ ---   ┆ --- ┆ ---  │
     * │ str      ┆ f64   ┆ f64 ┆ f64  │
     * ╞══════════╪═══════╪═════╪══════╡
     * │ "mean"   ┆ 2.267 ┆ 5   ┆ null │
     * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ "std"    ┆ 1.102 ┆ 1   ┆ null │
     * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ "min"    ┆ 1     ┆ 4   ┆ 0.0  │
     * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ "max"    ┆ 3     ┆ 6   ┆ 1    │
     * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ "median" ┆ 2.8   ┆ 5   ┆ null │
     * ╰──────────┴───────┴─────┴──────╯
     * ```
     */
    describe(): DataFrame;
    /** @deprecated *since 0.4.0* use {@link unique} */
    distinct(maintainOrder?, subset?, keep?): DataFrame;
    /**
     * __Remove column from DataFrame and return as new.__
     * ___
     * @param name
     * @example
     * ```
     * >  df = pl.DataFrame({
     * ...    "foo": [1, 2, 3],
     * ...    "bar": [6.0, 7.0, 8.0],
     * ...    "ham": ['a', 'b', 'c'],
     * ...    "apple": ['a', 'b', 'c']
     * ...  })
     * >  df.drop(['ham', 'apple'])
     * shape: (3, 2)
     * ╭─────┬─────╮
     * │ foo ┆ bar │
     * │ --- ┆ --- │
     * │ i64 ┆ f64 │
     * ╞═════╪═════╡
     * │ 1   ┆ 6   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   │
     * ╰─────┴─────╯
     * ```
     */
    drop(name: string): DataFrame;
    drop(names: string[]): DataFrame;
    drop(name: string, ...names: string[]): DataFrame;
    /**
     * __Return a new DataFrame where the null values are dropped.__
     *
     * This method only drops nulls row-wise if any single value of the row is null.
     * ___
     * @example
     * ```
     * >  df = pl.DataFrame({
     * ...    "foo": [1, 2, 3],
     * ...    "bar": [6, null, 8],
     * ...    "ham": ['a', 'b', 'c']
     * ...  })
     * >  df.dropNulls()
     * shape: (2, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" │
     * └─────┴─────┴─────┘
     * ```
     */
    dropNulls(column: string): DataFrame;
    dropNulls(columns: string[]): DataFrame;
    dropNulls(...columns: string[]): DataFrame;
    /**
     * __Explode `DataFrame` to long format by exploding a column with Lists.__
     * ___
     * @param columns - column or columns to explode
     * @example
     * ```
     * >  df = pl.DataFrame({
     * ...    "letters": ["c", "c", "a", "c", "a", "b"],
     * ...    "nrs": [[1, 2], [1, 3], [4, 3], [5, 5, 5], [6], [2, 1, 2]]
     * ...  })
     * >  df
     * shape: (6, 2)
     * ╭─────────┬────────────╮
     * │ letters ┆ nrs        │
     * │ ---     ┆ ---        │
     * │ str     ┆ list [i64] │
     * ╞═════════╪════════════╡
     * │ "c"     ┆ [1, 2]     │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "c"     ┆ [1, 3]     │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "a"     ┆ [4, 3]     │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "c"     ┆ [5, 5, 5]  │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "a"     ┆ [6]        │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ "b"     ┆ [2, 1, 2]  │
     * ╰─────────┴────────────╯
     * >  df.explode("nrs")
     * shape: (13, 2)
     * ╭─────────┬─────╮
     * │ letters ┆ nrs │
     * │ ---     ┆ --- │
     * │ str     ┆ i64 │
     * ╞═════════╪═════╡
     * │ "c"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 2   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 3   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ ...     ┆ ... │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 5   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 6   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 2   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 2   │
     * ╰─────────┴─────╯
     * ```
     */
    explode(column: ExprOrString): DataFrame;
    explode(columns: ExprOrString[]): DataFrame;
    explode(column: ExprOrString, ...columns: ExprOrString[]): DataFrame;
    /**
     *
     *
     * __Extend the memory backed by this `DataFrame` with the values from `other`.__
     * ___
  
      Different from `vstack` which adds the chunks from `other` to the chunks of this `DataFrame`
      `extent` appends the data from `other` to the underlying memory locations and thus may cause a reallocation.
  
      If this does not cause a reallocation, the resulting data structure will not have any extra chunks
      and thus will yield faster queries.
  
      Prefer `extend` over `vstack` when you want to do a query after a single append. For instance during
      online operations where you add `n` rows and rerun a query.
  
      Prefer `vstack` over `extend` when you want to append many times before doing a query. For instance
      when you read in multiple files and when to store them in a single `DataFrame`.
      In the latter case, finish the sequence of `vstack` operations with a `rechunk`.
  
     * @param other DataFrame to vertically add.
     */
    extend(other: DataFrame): DataFrame;
    /**
     * Fill null/missing values by a filling strategy
     *
     * @param strategy - One of:
     *   - "backward"
     *   - "forward"
     *   - "mean"
     *   - "min'
     *   - "max"
     *   - "zero"
     *   - "one"
     * @returns DataFrame with None replaced with the filling strategy.
     */
    fillNull(strategy: FillNullStrategy): DataFrame;
    /**
     * Filter the rows in the DataFrame based on a predicate expression.
     * ___
     * @param predicate - Expression that evaluates to a boolean Series.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * // Filter on one condition
     * > df.filter(pl.col("foo").lt(3))
     * shape: (2, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ a   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ b   │
     * └─────┴─────┴─────┘
     * // Filter on multiple conditions
     * > df.filter(
     * ... pl.col("foo").lt(3)
     * ...   .and(pl.col("ham").eq("a"))
     * ... )
     * shape: (1, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ a   │
     * └─────┴─────┴─────┘
     * ```
     */
    filter(predicate: any): DataFrame;
    /**
     * Find the index of a column by name.
     * ___
     * @param name -Name of the column to find.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.findIdxByName("ham"))
     * 2
     * ```
     */
    findIdxByName(name: string): number;
    /**
     * __Apply a horizontal reduction on a DataFrame.__
     *
     * This can be used to effectively determine aggregations on a row level,
     * and can be applied to any DataType that can be supercasted (casted to a similar parent type).
     *
     * An example of the supercast rules when applying an arithmetic operation on two DataTypes are for instance:
     *  - Int8 + Utf8 = Utf8
     *  - Float32 + Int64 = Float32
     *  - Float32 + Float64 = Float64
     * ___
     * @param operation - function that takes two `Series` and returns a `Series`.
     * @returns Series
     * @example
     * ```
     * > // A horizontal sum operation
     * > df = pl.DataFrame({
     * ...   "a": [2, 1, 3],
     * ...   "b": [1, 2, 3],
     * ...   "c": [1.0, 2.0, 3.0]
     * ... })
     * > df.fold((s1, s2) => s1.plus(s2))
     * Series: 'a' [f64]
     * [
     *     4
     *     5
     *     9
     * ]
     * > // A horizontal minimum operation
     * > df = pl.DataFrame({
     * ...   "a": [2, 1, 3],
     * ...   "b": [1, 2, 3],
     * ...   "c": [1.0, 2.0, 3.0]
     * ... })
     * > df.fold((s1, s2) => s1.zipWith(s1.lt(s2), s2))
     * Series: 'a' [f64]
     * [
     *     1
     *     1
     *     3
     * ]
     * > // A horizontal string concatenation
     * > df = pl.DataFrame({
     * ...   "a": ["foo", "bar", 2],
     * ...   "b": [1, 2, 3],
     * ...   "c": [1.0, 2.0, 3.0]
     * ... })
     * > df.fold((s1, s2) => s.plus(s2))
     * Series: '' [f64]
     * [
     *     "foo11"
     *     "bar22
     *     "233"
     * ]
     * ```
     */
    fold(operation: (s1: Series, s2: Series) => Series): Series;
    /**
     * Check if DataFrame is equal to other.
     * ___
     * @param options
     * @param options.other - DataFrame to compare.
     * @param options.nullEqual Consider null values as equal.
     * @example
     * ```
     * > df1 = pl.DataFrame({
     * ...    "foo": [1, 2, 3],
     * ...    "bar": [6.0, 7.0, 8.0],
     * ...    "ham": ['a', 'b', 'c']
     * ... })
     * > df2 = pl.DataFrame({
     * ...   "foo": [3, 2, 1],
     * ...   "bar": [8.0, 7.0, 6.0],
     * ...   "ham": ['c', 'b', 'a']
     * ... })
     * > df1.frameEqual(df1)
     * true
     * > df1.frameEqual(df2)
     * false
     * ```
     */
    frameEqual(other: DataFrame): boolean;
    frameEqual(other: DataFrame, nullEqual: boolean): boolean;
    /**
     * Get a single column as Series by name.
     */
    getColumn(name: string): Series;
    /**
     * Get the DataFrame as an Array of Series.
     */
    getColumns(): Array<Series>;
    /**
     * Start a groupby operation.
     * ___
     * @param by - Column(s) to group by.
     */
    groupBy(...by: ColumnSelection[]): GroupBy;
    /**
     * Hash and combine the rows in this DataFrame. _(Hash value is UInt64)_
     * @param k0 - seed parameter
     * @param k1 - seed parameter
     * @param k2 - seed parameter
     * @param k3 - seed parameter
     */
    hashRows(k0?: number, k1?: number, k2?: number, k3?: number): Series;
    hashRows(options: {
        k0?: number;
        k1?: number;
        k2?: number;
        k3?: number;
    }): Series;
    /**
     * Get first N rows as DataFrame.
     * ___
     * @param length -  Length of the head.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3, 4, 5],
     * ...   "bar": [6, 7, 8, 9, 10],
     * ...   "ham": ['a', 'b', 'c', 'd','e']
     * ... })
     * > df.head(3)
     * shape: (3, 3)
     * ╭─────┬─────┬─────╮
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" │
     * ╰─────┴─────┴─────╯
     * ```
     */
    head(length?: number): DataFrame;
    /**
     * Return a new DataFrame grown horizontally by stacking multiple Series to it.
     * @param columns - array of Series or DataFrame to stack
     * @param inPlace - Modify in place
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > x = pl.Series("apple", [10, 20, 30])
     * > df.hStack([x])
     * shape: (3, 4)
     * ╭─────┬─────┬─────┬───────╮
     * │ foo ┆ bar ┆ ham ┆ apple │
     * │ --- ┆ --- ┆ --- ┆ ---   │
     * │ i64 ┆ i64 ┆ str ┆ i64   │
     * ╞═════╪═════╪═════╪═══════╡
     * │ 1   ┆ 6   ┆ "a" ┆ 10    │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" ┆ 20    │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" ┆ 30    │
     * ╰─────┴─────┴─────┴───────╯
     * ```
     */
    hstack(columns: Array<Series> | DataFrame): DataFrame;
    hstack(columns: Array<Series> | DataFrame, inPlace?: boolean): void;
    /**
     * Insert a Series at a certain column index. This operation is in place.
     * @param index - Column position to insert the new `Series` column.
     * @param series - `Series` to insert
     */
    insertAtIdx(index: number, series: Series): void;
    /**
     * Interpolate intermediate values. The interpolation method is linear.
     */
    interpolate(): DataFrame;
    /**
     * Get a mask of all duplicated rows in this DataFrame.
     */
    isDuplicated(): Series;
    /**
     * Check if the dataframe is empty
     */
    isEmpty(): boolean;
    /**
     * Get a mask of all unique rows in this DataFrame.
     */
    isUnique(): Series;
    /**
     *  __SQL like joins.__
     * @param df - DataFrame to join with.
     * @param options
     * @param options.leftOn - Name(s) of the left join column(s).
     * @param options.rightOn - Name(s) of the right join column(s).
     * @param options.on - Name(s) of the join columns in both DataFrames.
     * @param options.how - Join strategy
     * @param options.suffix - Suffix to append to columns with a duplicate name.
     * @see {@link JoinOptions}
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6.0, 7.0, 8.0],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > otherDF = pl.DataFrame({
     * ...   "apple": ['x', 'y', 'z'],
     * ...   "ham": ['a', 'b', 'd']
     * ... })
     * > df.join(otherDF, {on: 'ham'})
     * shape: (2, 4)
     * ╭─────┬─────┬─────┬───────╮
     * │ foo ┆ bar ┆ ham ┆ apple │
     * │ --- ┆ --- ┆ --- ┆ ---   │
     * │ i64 ┆ f64 ┆ str ┆ str   │
     * ╞═════╪═════╪═════╪═══════╡
     * │ 1   ┆ 6   ┆ "a" ┆ "x"   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" ┆ "y"   │
     * ╰─────┴─────┴─────┴───────╯
     * ```
     */
    join(
        other: DataFrame,
        options: { on: ValueOrArray<string> } & Omit<
            JoinOptions,
            "leftOn" | "rightOn"
        >,
    ): DataFrame;
    join(
        other: DataFrame,
        options: {
            leftOn: ValueOrArray<string>;
            rightOn: ValueOrArray<string>;
        } & Omit<JoinOptions, "on">,
    ): DataFrame;
    join(other: DataFrame, options: { how: "cross"; suffix?: string }): DataFrame;

    /**
     * Perform an asof join. This is similar to a left-join except that we
     * match on nearest key rather than equal keys.
     *
     * Both DataFrames must be sorted by the asofJoin key.
     *
     * For each row in the left DataFrame:
     * - A "backward" search selects the last row in the right DataFrame whose
     *   'on' key is less than or equal to the left's key.
     *
     *  - A "forward" search selects the first row in the right DataFrame whose
     *    'on' key is greater than or equal to the left's key.
     *
     * The default is "backward".
     *
     * @param other DataFrame to join with.
     * @param options.leftOn Join column of the left DataFrame.
     * @param options.rightOn Join column of the right DataFrame.
     * @param options.on Join column of both DataFrames. If set, `leftOn` and `rightOn` should be undefined.
     * @param options.byLeft join on these columns before doing asof join
     * @param options.byRight join on these columns before doing asof join
     * @param options.strategy One of 'forward', 'backward'
     * @param options.suffix Suffix to append to columns with a duplicate name.
     * @param options.tolerance
     *   Numeric tolerance. By setting this the join will only be done if the near keys are within this distance.
     *   If an asof join is done on columns of dtype "Date", "Datetime" you
     *   use the following string language:
     *
     *   - 1ns   *(1 nanosecond)*
     *   - 1us   *(1 microsecond)*
     *   - 1ms   *(1 millisecond)*
     *   - 1s    *(1 second)*
     *   - 1m    *(1 minute)*
     *   - 1h    *(1 hour)*
     *   - 1d    *(1 day)*
     *   - 1w    *(1 week)*
     *   - 1mo   *(1 calendar month)*
     *   - 1y    *(1 calendar year)*
     *   - 1i    *(1 index count)*
     *
     * Or combine them:
     *   - "3d12h4m25s" # 3 days, 12 hours, 4 minutes, and 25 seconds
     * @param options.allowParallel Allow the physical plan to optionally evaluate the computation of both DataFrames up to the join in parallel.
     * @param options.forceParallel Force the physical plan to evaluate the computation of both DataFrames up to the join in parallel.
     *
     * @example
     * ```
     * > const gdp = pl.DataFrame({
     * ...   date: [
     * ...     new Date('2016-01-01'),
     * ...     new Date('2017-01-01'),
     * ...     new Date('2018-01-01'),
     * ...     new Date('2019-01-01'),
     * ...   ],  // note record date: Jan 1st (sorted!)
     * ...   gdp: [4164, 4411, 4566, 4696],
     * ... })
     * > const population = pl.DataFrame({
     * ...   date: [
     * ...     new Date('2016-05-12'),
     * ...     new Date('2017-05-12'),
     * ...     new Date('2018-05-12'),
     * ...     new Date('2019-05-12'),
     * ...   ],  // note record date: May 12th (sorted!)
     * ...   "population": [82.19, 82.66, 83.12, 83.52],
     * ... })
     * > population.joinAsof(
     * ...   gdp,
     * ...   {leftOn:"date", rightOn:"date", strategy:"backward"}
     * ... )
     *   shape: (4, 3)
     *   ┌─────────────────────┬────────────┬──────┐
     *   │ date                ┆ population ┆ gdp  │
     *   │ ---                 ┆ ---        ┆ ---  │
     *   │ datetime[μs]        ┆ f64        ┆ i64  │
     *   ╞═════════════════════╪════════════╪══════╡
     *   │ 2016-05-12 00:00:00 ┆ 82.19      ┆ 4164 │
     *   ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     *   │ 2017-05-12 00:00:00 ┆ 82.66      ┆ 4411 │
     *   ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     *   │ 2018-05-12 00:00:00 ┆ 83.12      ┆ 4566 │
     *   ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     *   │ 2019-05-12 00:00:00 ┆ 83.52      ┆ 4696 │
     *   └─────────────────────┴────────────┴──────┘
     * ```
     */
    joinAsof(
        other: DataFrame,
        options: {
            leftOn?: string;
            rightOn?: string;
            on?: string;
            byLeft?: string | string[];
            byRight?: string | string[];
            by?: string | string[];
            strategy?: "backward" | "forward";
            suffix?: string;
            tolerance?: number | string;
            allowParallel?: boolean;
            forceParallel?: boolean;
        },
    ): DataFrame;
    lazy(): LazyDataFrame;
    /**
     * Get first N rows as DataFrame.
     * @see {@link head}
     */
    limit(length?: number): DataFrame;
    map(func: (...args: any[]) => any): any[];

    /**
     * Aggregate the columns of this DataFrame to their maximum value.
     * ___
     * @param axis - either 0 or 1
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.max()
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ i64 ┆ i64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 3   ┆ 8   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    max(): DataFrame;
    max(axis: 0): DataFrame;
    max(axis: 1): Series;
    /**
     * Aggregate the columns of this DataFrame to their mean value.
     * ___
     *
     * @param axis - either 0 or 1
     * @param nullStrategy - this argument is only used if axis == 1
     */
    mean(): DataFrame;
    mean(axis: 0): DataFrame;
    mean(axis: 1): Series;
    mean(axis: 1, nullStrategy?: "ignore" | "propagate"): Series;
    /**
     * Aggregate the columns of this DataFrame to their median value.
     * ___
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.median()
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ f64 ┆ f64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 2   ┆ 7   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    median(): DataFrame;
    /**
     * Unpivot DataFrame to long format.
     * ___
     *
     * @param idVars - Columns to use as identifier variables.
     * @param valueVars - Values to use as value variables.
     * @example
     * ```
     * > df1 = pl.DataFrame({
     * ...   'id': [1],
     * ...   'asset_key_1': ['123'],
     * ...   'asset_key_2': ['456'],
     * ...   'asset_key_3': ['abc'],
     * ... })
     * > df1.melt('id', ['asset_key_1', 'asset_key_2', 'asset_key_3'])
     * shape: (3, 3)
     * ┌─────┬─────────────┬───────┐
     * │ id  ┆ variable    ┆ value │
     * │ --- ┆ ---         ┆ ---   │
     * │ f64 ┆ str         ┆ str   │
     * ╞═════╪═════════════╪═══════╡
     * │ 1   ┆ asset_key_1 ┆ 123   │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 1   ┆ asset_key_2 ┆ 456   │
     * ├╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 1   ┆ asset_key_3 ┆ abc   │
     * └─────┴─────────────┴───────┘
     * ```
     */
    melt(idVars: ColumnSelection, valueVars: ColumnSelection): DataFrame;
    /**
     * Aggregate the columns of this DataFrame to their minimum value.
     * ___
     * @param axis - either 0 or 1
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.min()
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ i64 ┆ i64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 1   ┆ 6   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    min(): DataFrame;
    min(axis: 0): DataFrame;
    min(axis: 1): Series;
    /**
     * Get number of chunks used by the ChunkedArrays of this DataFrame.
     */
    nChunks(): number;
    /**
     * Create a new DataFrame that shows the null counts per column.
     * ___
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, null, 3],
     * ...   "bar": [6, 7, null],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.nullCount()
     * shape: (1, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ u32 ┆ u32 ┆ u32 │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 1   ┆ 0   │
     * └─────┴─────┴─────┘
     * ```
     */
    nullCount(): DataFrame;
    partitionBy(
        cols: string | string[],
        stable?: boolean,
        includeKey?: boolean,
    ): DataFrame[];
    partitionBy<T>(
        cols: string | string[],
        stable: boolean,
        includeKey: boolean,
        mapFn: (df: DataFrame) => T,
    ): T[];
    /**
     *
     *   Create a spreadsheet-style pivot table as a DataFrame.
     *
     *   @param values Column values to aggregate. Can be multiple columns if the *columns* arguments contains multiple columns as well
     *   @param options.index One or multiple keys to group by
     *   @param options.columns Columns whose values will be used as the header of the output DataFrame
     *   @param options.aggregateFunc
     *       Any of:
     *       - "sum"
     *       - "max"
     *       - "min"
     *       - "mean"
     *       - "median"
     *       - "first"
     *       - "last"
     *       - "count"
     *     Defaults to "first"
     *   @param options.maintainOrder Sort the grouped keys so that the output order is predictable.
     *   @param options.sortColumns Sort the transposed columns by name. Default is by order of discovery.
     *   @example
     * ```
     *   > df = pl.DataFrame(
     *   ...     {
     *   ...         "foo": ["one", "one", "one", "two", "two", "two"],
     *   ...         "bar": ["A", "B", "C", "A", "B", "C"],
     *   ...         "baz": [1, 2, 3, 4, 5, 6],
     *   ...     }
     *   ... )
     *   > df.pivot({values:"baz", index:"foo", columns:"bar"})
     *   shape: (2, 4)
     *   ┌─────┬─────┬─────┬─────┐
     *   │ foo ┆ A   ┆ B   ┆ C   │
     *   │ --- ┆ --- ┆ --- ┆ --- │
     *   │ str ┆ i64 ┆ i64 ┆ i64 │
     *   ╞═════╪═════╪═════╪═════╡
     *   │ one ┆ 1   ┆ 2   ┆ 3   │
     *   ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     *   │ two ┆ 4   ┆ 5   ┆ 6   │
     *   └─────┴─────┴─────┴─────┘
     *    ```
     */
    pivot(
        values: string | string[],
        options: {
            index: string | string[];
            columns: string | string[];
            aggregateFunc?:
            | "sum"
            | "max"
            | "min"
            | "mean"
            | "median"
            | "first"
            | "last"
            | "count"
            | Expr;
            maintainOrder?: boolean;
            sortColumns?: boolean;
        },
    ): DataFrame;
    pivot(options: {
        values: string | string[];
        index: string | string[];
        columns: string | string[];
        aggregateFunc?:
        | "sum"
        | "max"
        | "min"
        | "mean"
        | "median"
        | "first"
        | "last"
        | "count"
        | Expr;
        maintainOrder?: boolean;
        sortColumns?: boolean;
    }): DataFrame;
    // TODO!
    // /**
    //  * Apply a function on Self.
    //  */
    // pipe(func: (...args: any[]) => T, ...args: any[]): T
    /**
     * Aggregate the columns of this DataFrame to their quantile value.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.quantile(0.5)
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ i64 ┆ i64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 2   ┆ 7   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    quantile(quantile: number): DataFrame;
    /**
     * __Rechunk the data in this DataFrame to a contiguous allocation.__
     *
     * This will make sure all subsequent operations have optimal and predictable performance.
     */
    rechunk(): DataFrame;
    /**
     * __Rename column names.__
     * ___
     *
     * @param mapping - Key value pairs that map from old name to new name.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.rename({"foo": "apple"})
     * ╭───────┬─────┬─────╮
     * │ apple ┆ bar ┆ ham │
     * │ ---   ┆ --- ┆ --- │
     * │ i64   ┆ i64 ┆ str │
     * ╞═══════╪═════╪═════╡
     * │ 1     ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2     ┆ 7   ┆ "b" │
     * ├╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3     ┆ 8   ┆ "c" │
     * ╰───────┴─────┴─────╯
     * ```
     */
    rename(mapping: Record<string, string>): DataFrame;
    /**
     * Replace a column at an index location.
     * ___
     * @param index - Column index
     * @param newColumn - New column to insert
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > x = pl.Series("apple", [10, 20, 30])
     * > df.replaceAtIdx(0, x)
     * shape: (3, 3)
     * ╭───────┬─────┬─────╮
     * │ apple ┆ bar ┆ ham │
     * │ ---   ┆ --- ┆ --- │
     * │ i64   ┆ i64 ┆ str │
     * ╞═══════╪═════╪═════╡
     * │ 10    ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 20    ┆ 7   ┆ "b" │
     * ├╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 30    ┆ 8   ┆ "c" │
     * ╰───────┴─────┴─────╯
     * ```
     */
    replaceAtIdx(index: number, newColumn: Series): void;
    /**
     * Get a row as Array
     * @param index - row index
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.row(2)
     * [3, 8, 'c']
     * ```
     */
    row(index: number): Array<any>;
    /**
     * Convert columnar data to rows as arrays
     */
    rows(): Array<Array<any>>;
    get schema(): Record<string, DataType>;
    /**
     * Select columns from this DataFrame.
     * ___
     * @param columns - Column or columns to select.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...     "foo": [1, 2, 3],
     * ...     "bar": [6, 7, 8],
     * ...     "ham": ['a', 'b', 'c']
     * ...     })
     * > df.select('foo')
     * shape: (3, 1)
     * ┌─────┐
     * │ foo │
     * │ --- │
     * │ i64 │
     * ╞═════╡
     * │ 1   │
     * ├╌╌╌╌╌┤
     * │ 2   │
     * ├╌╌╌╌╌┤
     * │ 3   │
     * └─────┘
     * ```
     */
    select(...columns: ExprOrString[]): DataFrame;
    /**
     * Shift the values by a given period and fill the parts that will be empty due to this operation
     * with `Nones`.
     * ___
     * @param periods - Number of places to shift (may be negative).
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.shift(1)
     * shape: (3, 3)
     * ┌──────┬──────┬──────┐
     * │ foo  ┆ bar  ┆ ham  │
     * │ ---  ┆ ---  ┆ ---  │
     * │ i64  ┆ i64  ┆ str  │
     * ╞══════╪══════╪══════╡
     * │ null ┆ null ┆ null │
     * ├╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 1    ┆ 6    ┆ "a"  │
     * ├╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 2    ┆ 7    ┆ "b"  │
     * └──────┴──────┴──────┘
     * > df.shift(-1)
     * shape: (3, 3)
     * ┌──────┬──────┬──────┐
     * │ foo  ┆ bar  ┆ ham  │
     * │ ---  ┆ ---  ┆ ---  │
     * │ i64  ┆ i64  ┆ str  │
     * ╞══════╪══════╪══════╡
     * │ 2    ┆ 7    ┆ "b"  │
     * ├╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ 3    ┆ 8    ┆ "c"  │
     * ├╌╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌┤
     * │ null ┆ null ┆ null │
     * └──────┴──────┴──────┘
     * ```
     */
    shift(periods: number): DataFrame;
    shift({ periods }: { periods: number }): DataFrame;
    /**
     * Shift the values by a given period and fill the parts that will be empty due to this operation
     * with the result of the `fill_value` expression.
     * ___
     * @param opts
     * @param opts.periods - Number of places to shift (may be negative).
     * @param opts.fillValue - fill null values with this value.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.shiftAndFill({periods:1, fill_value:0})
     * shape: (3, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 0   ┆ 0   ┆ "0" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 1   ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" │
     * └─────┴─────┴─────┘
     * ```
     */
    shiftAndFill(periods: number, fillValue: number | string): DataFrame;
    shiftAndFill({
        periods,
        fillValue,
    }: {
        periods: number;
        fillValue: number | string;
    }): DataFrame;
    /**
     * Shrink memory usage of this DataFrame to fit the exact capacity needed to hold the data.
     */
    shrinkToFit(): DataFrame;
    shrinkToFit(inPlace: true): void;
    shrinkToFit({ inPlace }: { inPlace: true }): void;
    /**
     * Slice this DataFrame over the rows direction.
     * ___
     * @param opts
     * @param opts.offset - Offset index.
     * @param opts.length - Length of the slice
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6.0, 7.0, 8.0],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.slice(1, 2) // Alternatively `df.slice({offset:1, length:2})`
     * shape: (2, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 2   ┆ 7   ┆ "b" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" │
     * └─────┴─────┴─────┘
     * ```
     */
    slice({ offset, length }: { offset: number; length: number }): DataFrame;
    slice(offset: number, length: number): DataFrame;
    /**
     * Sort the DataFrame by column.
     * ___
     * @param by - By which columns to sort. Only accepts string.
     * @param reverse - Reverse/descending sort.
     */
    sort(
        by: ColumnsOrExpr,
        descending?: boolean,
        maintain_order?: boolean,
    ): DataFrame;
    sort({
        by,
        descending,
        maintain_order,
    }: {
        by: ColumnsOrExpr;
        descending?: boolean;
        maintain_order?: boolean;
    }): DataFrame;
    /**
     * Aggregate the columns of this DataFrame to their standard deviation value.
     * ___
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.std()
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ f64 ┆ f64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 1   ┆ 1   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    std(): DataFrame;
    /**
     * Aggregate the columns of this DataFrame to their mean value.
     * ___
     *
     * @param axis - either 0 or 1
     * @param nullStrategy - this argument is only used if axis == 1
     */
    sum(): DataFrame;
    sum(axis: 0): DataFrame;
    sum(axis: 1): Series;
    sum(axis: 1, nullStrategy?: "ignore" | "propagate"): Series;
    /**
     *
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "letters": ["c", "c", "a", "c", "a", "b"],
     * ...   "nrs": [1, 2, 3, 4, 5, 6]
     * ... })
     * > df
     * shape: (6, 2)
     * ╭─────────┬─────╮
     * │ letters ┆ nrs │
     * │ ---     ┆ --- │
     * │ str     ┆ i64 │
     * ╞═════════╪═════╡
     * │ "c"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 2   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 3   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 4   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 5   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 6   │
     * ╰─────────┴─────╯
     * > df.groupby("letters")
     * ...   .tail(2)
     * ...   .sort("letters")
     * shape: (5, 2)
     * ╭─────────┬─────╮
     * │ letters ┆ nrs │
     * │ ---     ┆ --- │
     * │ str     ┆ i64 │
     * ╞═════════╪═════╡
     * │ "a"     ┆ 3   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 5   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 6   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 2   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 4   │
     * ╰─────────┴─────╯
     * ```
     */
    tail(length?: number): DataFrame;
    /**
     * @deprecated *since 0.4.0* use {@link writeCSV}
     * @category Deprecated
     */
    toCSV(destOrOptions?, options?);
    /**
     * Converts dataframe object into row oriented javascript objects
     * @example
     * ```
     * > df.toRecords()
     * [
     *   {"foo":1.0,"bar":"a"},
     *   {"foo":2.0,"bar":"b"},
     *   {"foo":3.0,"bar":"c"}
     * ]
     * ```
     * @category IO
     */
    toRecords(): Record<string, any>[];

    /**
     * compat with `JSON.stringify`
     * @category IO
     */
    toJSON(): string;

    /**
     * Converts dataframe object into column oriented javascript objects
     * @example
     * ```
     * > df.toObject()
     * {
     *  "foo": [1,2,3],
     *  "bar": ["a", "b", "c"]
     * }
     * ```
     * @category IO
     */
    toObject(): Record<string, any[]>;

    /**
     * @deprecated *since 0.4.0* use {@link writeIPC}
     * @category IO Deprecated
     */
    toIPC(destination?, options?);
    /**
     * @deprecated *since 0.4.0* use {@link writeParquet}
     * @category IO Deprecated
     */
    toParquet(destination?, options?);
    toSeries(index?: number): Series;
    toString(): string;
    /**
     *  Convert a ``DataFrame`` to a ``Series`` of type ``Struct``
     *  @param name Name for the struct Series
     *  @example
     *  ```
     *  > df = pl.DataFrame({
     *  ...   "a": [1, 2, 3, 4, 5],
     *  ...   "b": ["one", "two", "three", "four", "five"],
     *  ... })
     *  > df.toStruct("nums")
     *  shape: (5,)
     *  Series: 'nums' [struct[2]{'a': i64, 'b': str}]
     *  [
     *          {1,"one"}
     *          {2,"two"}
     *          {3,"three"}
     *          {4,"four"}
     *          {5,"five"}
     *  ]
     *  ```
     */
    toStruct(name: string): Series;
    /**
     * Transpose a DataFrame over the diagonal.
     *
     * @remarks This is a very expensive operation. Perhaps you can do it differently.
     * @param options
     * @param options.includeHeader If set, the column names will be added as first column.
     * @param options.headerName If `includeHeader` is set, this determines the name of the column that will be inserted
     * @param options.columnNames Optional generator/iterator that yields column names. Will be used to replace the columns in the DataFrame.
     *
     * @example
     * > df = pl.DataFrame({"a": [1, 2, 3], "b": [1, 2, 3]})
     * > df.transpose({includeHeader:true})
     * shape: (2, 4)
     * ┌────────┬──────────┬──────────┬──────────┐
     * │ column ┆ column_0 ┆ column_1 ┆ column_2 │
     * │ ---    ┆ ---      ┆ ---      ┆ ---      │
     * │ str    ┆ i64      ┆ i64      ┆ i64      │
     * ╞════════╪══════════╪══════════╪══════════╡
     * │ a      ┆ 1        ┆ 2        ┆ 3        │
     * ├╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌┤
     * │ b      ┆ 1        ┆ 2        ┆ 3        │
     * └────────┴──────────┴──────────┴──────────┘
     * // replace the auto generated column names with a list
     * > df.transpose({includeHeader:false, columnNames:["a", "b", "c"]})
     * shape: (2, 3)
     * ┌─────┬─────┬─────┐
     * │ a   ┆ b   ┆ c   │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ i64 │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 2   ┆ 3   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 1   ┆ 2   ┆ 3   │
     * └─────┴─────┴─────┘
     *
     * // Include the header as a separate column
     * > df.transpose({
     * ...     includeHeader:true,
     * ...     headerName:"foo",
     * ...     columnNames:["a", "b", "c"]
     * ... })
     * shape: (2, 4)
     * ┌─────┬─────┬─────┬─────┐
     * │ foo ┆ a   ┆ b   ┆ c   │
     * │ --- ┆ --- ┆ --- ┆ --- │
     * │ str ┆ i64 ┆ i64 ┆ i64 │
     * ╞═════╪═════╪═════╪═════╡
     * │ a   ┆ 1   ┆ 2   ┆ 3   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ b   ┆ 1   ┆ 2   ┆ 3   │
     * └─────┴─────┴─────┴─────┘
     *
     * // Replace the auto generated column with column names from a generator function
     * > function *namesGenerator() {
     * ...     const baseName = "my_column_";
     * ...     let count = 0;
     * ...     let name = `${baseName}_${count}`;
     * ...     count++;
     * ...     yield name;
     * ... }
     * > df.transpose({includeHeader:false, columnNames:namesGenerator})
     * shape: (2, 3)
     * ┌─────────────┬─────────────┬─────────────┐
     * │ my_column_0 ┆ my_column_1 ┆ my_column_2 │
     * │ ---         ┆ ---         ┆ ---         │
     * │ i64         ┆ i64         ┆ i64         │
     * ╞═════════════╪═════════════╪═════════════╡
     * │ 1           ┆ 2           ┆ 3           │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ 1           ┆ 2           ┆ 3           │
     * └─────────────┴─────────────┴─────────────┘
     */
    transpose(options?: {
        includeHeader?: boolean;
        headerName?: string;
        columnNames?: Iterable<string>;
    });
    /**
     * Drop duplicate rows from this DataFrame.
     * Note that this fails if there is a column of type `List` in the DataFrame.
     * @param maintainOrder
     * @param subset - subset to drop duplicates for
     * @param keep "first" | "last"
     */
    unique(
        maintainOrder?: boolean,
        subset?: ColumnSelection,
        keep?: "first" | "last",
    ): DataFrame;
    unique(opts: {
        maintainOrder?: boolean;
        subset?: ColumnSelection;
        keep?: "first" | "last";
    }): DataFrame;
    /**
        Decompose a struct into its fields. The fields will be inserted in to the `DataFrame` on the
        location of the `struct` type.
        @param names Names of the struct columns that will be decomposed by its fields
        @example
        ```
        > df = pl.DataFrame({
        ...   "int": [1, 2],
        ...   "str": ["a", "b"],
        ...   "bool": [true, null],
        ...   "list": [[1, 2], [3]],
        ... })
        ...  .toStruct("my_struct")
        ...  .toFrame()
        > df
        shape: (2, 1)
        ┌─────────────────────────────┐
        │ my_struct                   │
        │ ---                         │
        │ struct[4]{'int',...,'list'} │
        ╞═════════════════════════════╡
        │ {1,"a",true,[1, 2]}         │
        ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
        │ {2,"b",null,[3]}            │
        └─────────────────────────────┘
        > df.unnest("my_struct")
        shape: (2, 4)
        ┌─────┬─────┬──────┬────────────┐
        │ int ┆ str ┆ bool ┆ list       │
        │ --- ┆ --- ┆ ---  ┆ ---        │
        │ i64 ┆ str ┆ bool ┆ list [i64] │
        ╞═════╪═════╪══════╪════════════╡
        │ 1   ┆ a   ┆ true ┆ [1, 2]     │
        ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
        │ 2   ┆ b   ┆ null ┆ [3]        │
        └─────┴─────┴──────┴────────────┘
        ```
       */
    unnest(names: string | string[]): DataFrame;
    /**
     * Aggregate the columns of this DataFrame to their variance value.
     * @example
     * ```
     * > df = pl.DataFrame({
     * >   "foo": [1, 2, 3],
     * >   "bar": [6, 7, 8],
     * >   "ham": ['a', 'b', 'c']
     * > })
     * > df.var()
     * shape: (1, 3)
     * ╭─────┬─────┬──────╮
     * │ foo ┆ bar ┆ ham  │
     * │ --- ┆ --- ┆ ---  │
     * │ f64 ┆ f64 ┆ str  │
     * ╞═════╪═════╪══════╡
     * │ 1   ┆ 1   ┆ null │
     * ╰─────┴─────┴──────╯
     * ```
     */
    var(): DataFrame;
    /**
     * Grow this DataFrame vertically by stacking a DataFrame to it.
     * @param df - DataFrame to stack.
     * @example
     * ```
     * > df1 = pl.DataFrame({
     * ...   "foo": [1, 2],
     * ...   "bar": [6, 7],
     * ...   "ham": ['a', 'b']
     * ... })
     * > df2 = pl.DataFrame({
     * ...   "foo": [3, 4],
     * ...   "bar": [8 , 9],
     * ...   "ham": ['c', 'd']
     * ... })
     * > df1.vstack(df2)
     * shape: (4, 3)
     * ╭─────┬─────┬─────╮
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 4   ┆ 9   ┆ "d" │
     * ╰─────┴─────┴─────╯
     * ```
     */
    vstack(df: DataFrame): DataFrame;
    /**
     * Return a new DataFrame with the column added or replaced.
     * @param column - Series, where the name of the Series refers to the column in the DataFrame.
     */
    withColumn(column: Series | Expr): DataFrame;
    withColumn(column: Series | Expr): DataFrame;
    withColumns(...columns: (Expr | Series)[]): DataFrame;
    /**
     * Return a new DataFrame with the column renamed.
     * @param existingName
     * @param newName
     */
    withColumnRenamed(existing: string, replacement: string): DataFrame;
    withColumnRenamed(opts: { existing: string; replacement: string }): DataFrame;
    /**
     * Add a column at index 0 that counts the rows.
     * @param name - name of the column to add
     */
    withRowCount(name?: string): DataFrame;
    /** @see {@link filter} */
    where(predicate: any): DataFrame;
}
