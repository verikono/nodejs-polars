import { type RowCount } from 'nodejs-polars/types';


/** Options for {@link scanParquet} */
export interface ScanParquetOptions {
    columns?: string[] | number[];
    numRows?: number;
    parallel?: "auto" | "columns" | "row_groups" | "none";
    rowCount?: RowCount;
    cache?: boolean;
    rechunk?: boolean;
}
