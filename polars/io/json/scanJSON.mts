/**
 * __Read a JSON file or string into a DataFrame.__
 *
 * _Note: Currently only newline delimited JSON is supported_
 * @param path - path to json file
 *   - path: Path to a file or a file like string. Any valid filepath can be used. Example: `./file.json`.
 * @param options
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *    If set to `null`, a full table scan will be done (slow).
 * @param options.nThreads - Maximum number of threads to use when reading json.
 * @param options.lowMemory - Reduce memory usage in expense of performance.
 * @param options.batchSize - Number of lines to read into the buffer at once. Modify this to change performance.
 * @param options.numRows  Stop reading from parquet file after reading ``numRows``.
 * @param options.skipRows -Start reading after ``skipRows`` position.
 * @param options.rowCount Add row count as column
 * @returns ({@link DataFrame})
 * @example
 * ```
 * > const df = pl.scanJson('path/to/file.json', {numRows: 2}).collectSync()
 * > console.log(df)
 *   shape: (2, 3)
 * ╭─────┬─────┬─────╮
 * │ a   ┆ b   ┆ c   │
 * │ --- ┆ --- ┆ --- │
 * │ i64 ┆ str ┆ i64 │
 * ╞═════╪═════╪═════╡
 * │ 1   ┆ foo ┆ 3   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 2   ┆ bar ┆ 6   │
 * ╰─────┴─────┴─────╯
 * ```
 */
export function scanJson( path: string, options?: Partial<ScanJsonOptions> ): LazyDataFrame;
export function scanJson( path: string, options?: Partial<ScanJsonOptions> ) {
    options = { ...readJsonDefaultOptions, ...options };
    return _LazyDataFrame(pli.scanJson(path, options));
}
