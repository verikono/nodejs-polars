/**
 * Options for {@link DataFrame.writeParquet}
 * @category Options
 */
export interface WriteParquetOptions {
    compression?:
    | "uncompressed"
    | "snappy"
    | "gzip"
    | "lzo"
    | "brotli"
    | "lz4"
    | "zstd";
}
