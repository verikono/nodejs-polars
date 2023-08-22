import {
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import {
    type ReadIPCOptions
} from './index.mjs';

import { pli } from 'nodejs-polars/internals';



/**
 * __Read into a DataFrame from Arrow IPC (Feather v2) file.__
 * ___
 * @param pathOrBody - path or buffer or string
 *   - path: Path to a file or a file like string. Any valid filepath can be used. Example: `file.ipc`.
 *   - body: String or buffer to be read as Arrow IPC
 * @param options.columns Columns to select. Accepts a list of column names.
 * @param options.nRows Stop reading from parquet file after reading ``nRows``.
 */
export function readIPC( pathOrBody: string | Buffer, options?: Partial<ReadIPCOptions> ): DataFrame;
export function readIPC(pathOrBody, options = {}) {
    if (Buffer.isBuffer(pathOrBody)) {
        return _DataFrame(pli.readIpc(pathOrBody, options));
    }

    if (typeof pathOrBody === "string") {
        const inline = !isPath(pathOrBody, [".ipc"]);
        if (inline) {
            return _DataFrame(pli.readIpc(Buffer.from(pathOrBody, "utf-8"), options));
        } else {
            return _DataFrame(pli.readIpc(pathOrBody, options));
        }
    } else {
        throw new Error("must supply either a path or body");
    }
}
