import {
    type ReadCsvOptions,
    type ScanCsvOptions,
} from './typings.mjs';



/**
 * @todo 
 */
export const readCsvDefaultOptions: Partial<ReadCsvOptions> = {
    inferSchemaLength: 100,
    hasHeader: true,
    ignoreErrors: true,
    chunkSize: 10000,
    skipRows: 0,
    sep: ",",
    rechunk: false,
    encoding: "utf8",
    lowMemory: false,
    parseDates: false,
    skipRowsAfterHeader: 0,
};


/**
 * @todo 
 */
export const scanCsvDefaultOptions: Partial<ScanCsvOptions> = {
    inferSchemaLength: 100,
    cache: true,
    hasHeader: true,
    ignoreErrors: true,
    skipRows: 0,
    sep: ",",
    rechunk: false,
    encoding: "utf8",
    lowMemory: false,
    parseDates: false,
    skipRowsAfterHeader: 0,
};
