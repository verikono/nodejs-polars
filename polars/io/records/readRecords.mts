import { pli } from 'nodejs-polars/internals';

import { 
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import {
    type DataType,
} from 'nodejs-polars/datatypes';



export function readRecords( records: Record<string, any>[], options?: { schema: Record<string, DataType> } ): DataFrame;
export function readRecords( records: Record<string, any>[], options?: { inferSchemaLength?: number } ): DataFrame;
export function readRecords( records: Record<string, any>[], options ): DataFrame {
    if (options?.schema) {
        return _DataFrame(pli.fromRows(records, options.schema));
    } else {
        return _DataFrame(
            pli.fromRows(records, undefined, options?.inferSchemaLength),
        );
    }
}
