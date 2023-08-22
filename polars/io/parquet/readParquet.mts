import { pli } from 'nodejs-polars/internals';

import {
    isPath
} from 'nodejs-polars/utils';

import {
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import {
    type ReadParquetOptions,
} from './index.mjs';



/**
 * Read into a DataFrame from a parquet file.
 * @param pathOrBuffer
 * Path to a file, list of files, or a file like object. If the path is a directory, that directory will be used
 * as partition aware scan.
 * @param options.columns Columns to select. Accepts a list of column indices (starting at zero) or a list of column names.
 * @param options.numRows  Stop reading from parquet file after reading ``numRows``.
 * @param options.parallel
 *    Any of  'auto' | 'columns' |  'row_groups' | 'none'
        This determines the direction of parallelism. 'auto' will try to determine the optimal direction.
        Defaults to 'auto'
 * @param options.rowCount Add row count as column
 */
export function readParquet( pathOrBody: string | Buffer, options?: Partial<ReadParquetOptions> ): DataFrame {

    const pliOptions: any = {};

    if (typeof options?.columns?.[0] === "number") {
        pliOptions.projection = options?.columns;
    } else {
        pliOptions.columns = options?.columns;
    }

    pliOptions.nRows = options?.numRows;
    pliOptions.rowCount = options?.rowCount;
    const parallel = options?.parallel ?? "auto";

    if (Buffer.isBuffer(pathOrBody)) {
        return _DataFrame(pli.readParquet(pathOrBody, pliOptions, parallel));
    }

    if (typeof pathOrBody === "string") {
        const inline = !isPath(pathOrBody, [".parquet"]);
        if (inline) {
            return _DataFrame(
                pli.readParquet(Buffer.from(pathOrBody), pliOptions, parallel),
            );
        } else {
            return _DataFrame(pli.readParquet(pathOrBody, pliOptions, parallel));
        }
    } else {
        throw new Error("must supply either a path or body");
    }
}
