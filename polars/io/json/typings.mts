import { type RowCount } from 'nodejs-polars/io';

export interface ScanJsonOptions {
  inferSchemaLength: number | null;
  nThreads: number;
  batchSize: number;
  lowMemory: boolean;
  numRows: number;
  skipRows: number;
  rowCount: RowCount;
}

export interface ReadJsonOptions {
  batchSize: number;
  inferSchemaLength: number | null;
  format: "lines" | "json";
}
