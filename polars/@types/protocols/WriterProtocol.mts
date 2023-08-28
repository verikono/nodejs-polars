import {
    type Writable,
} from 'node:stream';

import {
    type WriteCsvOptions,
    type WriteParquetOptions,
    type WriteAvroOptions,
    type WriteIpcOptions,
} from 'nodejs-polars/types/options';



export interface WriterProtocol {


    /**
     * __Write DataFrame to comma-separated values file (csv).__
     *
     * If no options are specified, it will return a new string containing the contents
     * ___
     * @param dest file or stream to write to
     * @param options
     * @param options.hasHeader - Whether or not to include header in the CSV output.
     * @param options.sep - Separate CSV fields with this symbol. _defaults to `,`_
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   "foo": [1, 2, 3],
     * ...   "bar": [6, 7, 8],
     * ...   "ham": ['a', 'b', 'c']
     * ... })
     * > df.writeCSV()
     * foo,bar,ham
     * 1,6,a
     * 2,7,b
     * 3,8,c
     *
     * // using a file path
     * > df.head(1).writeCSV("./foo.csv")
     * // foo.csv
     * foo,bar,ham
     * 1,6,a
     *
     * // using a write stream
     * > const writeStream = new Stream.Writable({
     * ...   write(chunk, encoding, callback) {
     * ...     console.log("writeStream: %O', chunk.toString());
     * ...     callback(null);
     * ...   }
     * ... });
     * > df.head(1).writeCSV(writeStream, {hasHeader: false})
     * writeStream: '1,6,a'
     * ```
     * @category IO
     */
    writeCSV(): Buffer;
    writeCSV(options: WriteCsvOptions): Buffer;
    writeCSV(dest: string | Writable, options?: WriteCsvOptions): void;


    /**
     * Write Dataframe to JSON string, file, or write stream
     * @param destination file or write stream
     * @param options
     * @param options.format - json | lines
     * @example
     * ```
     * > const df = pl.DataFrame({
     * ...   foo: [1,2,3],
     * ...   bar: ['a','b','c']
     * ... })
     *
     *
     * > df.writeJSON({format:"json"})
     * `[ {"foo":1.0,"bar":"a"}, {"foo":2.0,"bar":"b"}, {"foo":3.0,"bar":"c"}]`
     *
     * > df.writeJSON({format:"lines"})
     * `{"foo":1.0,"bar":"a"}
     * {"foo":2.0,"bar":"b"}
     * {"foo":3.0,"bar":"c"}`
     *
     * // writing to a file
     * > df.writeJSON("/path/to/file.json", {format:'lines'})
     * ```
     * @category IO
     */
    writeJSON(options?: { format: "lines" | "json" }): Buffer;
    writeJSON(
        destination: string | Writable,
        options?: { format: "lines" | "json" },
    ): void;


    /**
     * Write to Arrow IPC binary stream, or a feather file.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeIPC(options?: WriteIpcOptions): Buffer;
    writeIPC(destination: string | Writable, options?: WriteIpcOptions): void;


    /**
     * Write the DataFrame disk in parquet format.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeParquet(options?: WriteParquetOptions): Buffer;
    writeParquet(
        destination: string | Writable,
        options?: WriteParquetOptions,
    ): void;


    /**
     * Write the DataFrame disk in avro format.
     * @param file File path to which the file should be written.
     * @param options.compression Compression method *defaults to "uncompressed"*
     * @category IO
     */
    writeAvro(options?: WriteAvroOptions): Buffer;
    writeAvro(destination: string | Writable, options?: WriteAvroOptions): void;

}
