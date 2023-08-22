import { pli } from 'nodejs-polars/internals';
import { scanCsvDefaultOptions } from './index.mjs';



/**
 * __Lazily read from a CSV file or multiple files via glob patterns.__
 *
 * This allows the query optimizer to push down predicates and
 * projections to the scan level, thereby potentially reducing
 * memory overhead.
 * ___
 * @param path path to a file
 * @param options.hasHeader - Indicate if first row of dataset is header or not. If set to False first row will be set to `column_x`,
 *     `x` being an enumeration over every column in the dataset.
 * @param options.sep -Character to use as delimiter in the file.
 * @param options.commentChar - character that indicates the start of a comment line, for instance '#'.
 * @param options.quoteChar -character that is used for csv quoting, default = ''. Set to null to turn special handling and escaping of quotes off.
 * @param options.skipRows -Start reading after `skipRows` position.
 * @param options.nullValues - Values to interpret as null values. You can provide a
 *     - `string` -> all values encountered equal to this string will be null
 *     - `Array<string>` -> A null value per column.
 *     - `Record<string,string>` -> An object or map that maps column name to a null value string.Ex. {"column_1": 0}
 * @param options.ignoreErrors -Try to keep reading lines if some lines yield errors.
 * @param options.cache Cache the result after reading.
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *     If set to `null`, a full table scan will be done (slow).
 * @param options.nRows -After n rows are read from the CSV, it stops reading.
 *     During multi-threaded parsing, an upper bound of `n` rows
 *     cannot be guaranteed.
 * @param options.rechunk -Make sure that all columns are contiguous in memory by aggregating the chunks into a single array.
 * @param options.lowMemory - Reduce memory usage in expense of performance.
 * ___
 *
 */
export function scanCSV( path: string, options?: Partial<ScanCsvOptions> ): LazyDataFrame;
export function scanCSV( path, options? ) {
    options = { ...scanCsvDefaultOptions, ...options };
    return _LazyDataFrame(pli.scanCsv(path, options));
}
