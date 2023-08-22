import {
    type ScanParquetOptions,
} from "./index.mjs";



/**
 * __Lazily read from a parquet file or multiple files via glob patterns.__
 * ___
 * This allows the query optimizer to push down predicates and projections to the scan level,
 * thereby potentially reducing memory overhead.
 * @param path Path to a file or or glob pattern
 * @param options.numRows Stop reading from parquet file after reading ``numRows``.
 * @param options.cache Cache the result after reading.
 * @param options.parallel Read the parquet file in parallel. The single threaded reader consumes less memory.
 * @param options.rechunk In case of reading multiple files via a glob pattern rechunk the final DataFrame into contiguous memory chunks.
 */
export function scanParquet(path: string, options: ScanParquetOptions = {}) {
    const pliOptions: any = {};
  
    pliOptions.nRows = options?.numRows;
    pliOptions.rowCount = options?.rowCount;
    pliOptions.parallel = options?.parallel ?? "auto";
    return _LazyDataFrame(pli.scanParquet(path, pliOptions));
  }
