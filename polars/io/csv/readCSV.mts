import {
    type ReadCsvOptions,
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
 * __Read a CSV file or string into a Dataframe.__
 * ___
 * @param pathOrBody - path or buffer or string
 *   - path: Path to a file or a file like string. Any valid filepath can be used. Example: `file.csv`.
 *   - body: String or buffer to be read as a CSV
 * @param options
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *     If set to `null`, a full table scan will be done (slow).
 * @param options.nRows -After n rows are read from the CSV, it stops reading.
 *     During multi-threaded parsing, an upper bound of `n` rows
 *     cannot be guaranteed.
 * @param options.batchSize - Number of lines to read into the buffer at once. Modify this to change performance.
 * @param options.hasHeader - Indicate if first row of dataset is header or not. If set to False first row will be set to `column_x`,
 *     `x` being an enumeration over every column in the dataset.
 * @param options.ignoreErrors -Try to keep reading lines if some lines yield errors.
 * @param options.endRows -After n rows are read from the CSV, it stops reading.
 *     During multi-threaded parsing, an upper bound of `n` rows
 *     cannot be guaranteed.
 * @param options.startRows -Start reading after `startRows` position.
 * @param options.projection -Indices of columns to select. Note that column indices start at zero.
 * @param options.sep -Character to use as delimiter in the file.
 * @param options.columns -Columns to select.
 * @param options.rechunk -Make sure that all columns are contiguous in memory by aggregating the chunks into a single array.
 * @param options.encoding -Allowed encodings: `utf8`, `utf8-lossy`. Lossy means that invalid utf8 values are replaced with `�` character.
 * @param options.numThreads -Number of threads to use in csv parsing. Defaults to the number of physical cpu's of your system.
 * @param options.dtype -Overwrite the dtypes during inference.
 * @param options.lowMemory - Reduce memory usage in expense of performance.
 * @param options.commentChar - character that indicates the start of a comment line, for instance '#'.
 * @param options.quotChar -character that is used for csv quoting, default = ''. Set to null to turn special handling and escaping of quotes off.
 * @param options.nullValues - Values to interpret as null values. You can provide a
 *     - `string` -> all values encountered equal to this string will be null
 *     - `Array<string>` -> A null value per column.
 *     - `Record<string,string>` -> An object or map that maps column name to a null value string.Ex. {"column_1": 0}
 * @param options.parseDates -Whether to attempt to parse dates or not
 * @returns DataFrame
 */
export function readCSV(pathOrBody: string | Buffer, options?: Partial<ReadCsvOptions>): DataFrame;
export function readCSV(pathOrBody, options?) {

    options = { ...readCsvDefaultOptions, ...options };

    const extensions = [".tsv", ".csv"];

    if (Buffer.isBuffer(pathOrBody)) {
        return _DataFrame(pli.readCsv(pathOrBody, options));
    }
    if (typeof pathOrBody === "string") {
        const inline = !isPath(pathOrBody, extensions);
        if (inline) {
            const buf = Buffer.from(pathOrBody, "utf-8");

            return _DataFrame(pli.readCsv(buf, options));
        } else {
            return _DataFrame(pli.readCsv(pathOrBody, options));
        }
    } else {
        throw new Error("must supply either a path or body");
    }
}




if(import.meta.vitest) {

    const {
        describe,
        expect,
        test,
    } = import.meta.vitest;

    describe(`nodejs-polars/io.readCSV`, () => {

        test(`csv files are importable`, () => {

        });

    });

}
