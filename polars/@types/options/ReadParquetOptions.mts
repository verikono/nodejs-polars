import { type RowCount } from 'nodejs-polars/types';

/**
 * Options for {@link readParquet}
 */
export interface ReadParquetOptions {
    columns?: string[] | number[];
    numRows?: number;
    parallel?: "auto" | "columns" | "row_groups" | "none";
    rowCount?: RowCount;
}
