import {
    type ReadAvroOptions,
    readCsvDefaultOptions,
} from './index.mjs';

import {
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import {
    pli
} from 'nodejs-polars/internals';




/**
 * Read into a DataFrame from an avro file.
 * @param pathOrBuffer
 * Path to a file, list of files, or a file like object. If the path is a directory, that directory will be used
 * as partition aware scan.
 * @param options.columns Columns to select. Accepts a list of column names.
 * @param options.projection -Indices of columns to select. Note that column indices start at zero.
 * @param options.nRows  Stop reading from avro file after reading ``nRows``.
 */
export function readAvro(
    pathOrBody: string | Buffer,
    options?: Partial<ReadAvroOptions>,
  ): DataFrame;
  export function readAvro(pathOrBody, options = {}) {
    if (Buffer.isBuffer(pathOrBody)) {
      return _DataFrame(pli.readAvro(pathOrBody, options));
    }
  
    if (typeof pathOrBody === "string") {
      const inline = !isPath(pathOrBody, [".avro"]);
      if (inline) {
        return _DataFrame(pli.readAvro(Buffer.from(pathOrBody), options));
      } else {
        return _DataFrame(pli.readAvro(pathOrBody, options));
      }
    } else {
      throw new Error("must supply either a path or body");
    }
  }
  