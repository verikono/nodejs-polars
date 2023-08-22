/**
 * __Read a stream into a Dataframe.__
 *
 * **Warning:** this is much slower than `scanCSV` or `readCSV`
 *
 * This will consume the entire stream into a single buffer and then call `readCSV`
 * Only use it when you must consume from a stream, or when performance is not a major consideration
 *
 * ___
 * @param stream - readable stream containing csv data
 * @param options
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *     If set to `null`, a full table scan will be done (slow).
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
 * @returns Promise<DataFrame>
 *
 * @example
 * ```
 * >>> const readStream = new Stream.Readable({read(){}});
 * >>> readStream.push(`a,b\n`);
 * >>> readStream.push(`1,2\n`);
 * >>> readStream.push(`2,2\n`);
 * >>> readStream.push(`3,2\n`);
 * >>> readStream.push(`4,2\n`);
 * >>> readStream.push(null);
 *
 * >>> pl.readCSVStream(readStream).then(df => console.log(df));
 * shape: (4, 2)
 * ┌─────┬─────┐
 * │ a   ┆ b   │
 * │ --- ┆ --- │
 * │ i64 ┆ i64 │
 * ╞═════╪═════╡
 * │ 1   ┆ 2   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 2   ┆ 2   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 3   ┆ 2   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 4   ┆ 2   │
 * └─────┴─────┘
 * ```
 */
export function readCSVStream( stream: Readable, options?: Partial<ReadCsvOptions> ): Promise<DataFrame>;
export function readCSVStream( stream, options? ) {

    const batchSize = options?.batchSize ?? 10000;
    let count = 0;
    const end = options?.endRows ?? Number.POSITIVE_INFINITY;

    return new Promise((resolve, reject) => {

        const s = stream.pipe(new LineBatcher({ batchSize }));
        const chunks: any[] = [];

        s.on("data", (chunk) => {
            // early abort if 'end rows' is specified
            if (count <= end) {
                chunks.push(chunk);
            } else {
                s.end();
            }
            count += batchSize;
        }).on("end", () => {
            try {
                const buff = Buffer.concat(chunks);
                const df = readCSVBuffer(buff, options);
                resolve(df);
            } catch (err) {
                reject(err);
            }
        });

    });

}
