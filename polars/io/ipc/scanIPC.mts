import { pli } from 'nodejs-polars/internals';
import { type ScanIPCOptions } from './index.mjs';



/**
 * __Lazily read from an Arrow IPC (Feather v2) file or multiple files via glob patterns.__
 * ___
 * @param path Path to a IPC file.
 * @param options.nRows Stop reading from IPC file after reading ``nRows``
 * @param options.cache Cache the result after reading.
 * @param options.rechunk Reallocate to contiguous memory when all chunks/ files are parsed.
 */
export function scanIPC(
    path: string,
    options?: Partial<ScanIPCOptions>,
): LazyDataFrame;
export function scanIPC(path, options = {}) {
    return _LazyDataFrame(pli.scanIpc(path, options));
}


