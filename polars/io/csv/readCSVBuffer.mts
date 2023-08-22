import { pli } from 'nodejs-polars/internals';
import { _DataFrame } from 'nodejs-polars/dataframe';
import { readCsvDefaultOptions } from './index.mjs';



export function readCSVBuffer(buff, options) {
    return _DataFrame( pli.readCsv(buff, { ...readCsvDefaultOptions, ...options }) );
}

