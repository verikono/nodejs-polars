import { type DataType } from 'nodejs-polars/datatypes';

export interface ScanCsvOptions {
    hasHeader: boolean;
    sep: string;
    commentChar: string;
    quoteChar: string;
    skipRows: number;
    nullValues: string | Array<string> | Record<string, string>;
    ignoreErrors: boolean;
    cache: boolean;
    inferSchemaLength: number | null;
    rechunk: boolean;
    nRows: number;
    encoding: string;
    lowMemory: boolean;
    parseDates: boolean;
    skipRowsAfterHeader: number;
}

export interface ReadCsvOptions {
    inferSchemaLength: number | null;
    nRows: number;
    batchSize: number;
    hasHeader: boolean;
    ignoreErrors: boolean;
    endRows: number;
    startRows: number;
    projection: number;
    sep: string;
    columns: string[];
    rechunk: boolean;
    encoding: "utf8" | "utf8-lossy";
    numThreads: number;
    dtypes: Record<string, DataType>;
    lowMemory: boolean;
    commentChar: string;
    quotChar: string;
    nullValues: string | Array<string> | Record<string, string>;
    chunkSize: number;
    skipRows: number;
    parseDates: boolean;
    skipRowsAfterHeader: number;
    rowCount: any;
}

