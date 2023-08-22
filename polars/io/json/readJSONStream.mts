import { Readable } from 'node:stream';
import { pli } from 'nodejs-polars/internals';

import {
  type DataFrame,
  _DataFrame
} from 'nodejs-polars/dataframe';

import {
  type ReadJsonOptions,
  readJsonDefaultOptions,
} from './index.mjs';

import { LineBatcher } from 'nodejs-polars/io';



/**
 * __Read a newline delimited JSON stream into a DataFrame.__
 *
 * @param stream - readable stream containing json data
 * @param options
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *    If set to `null`, a full table scan will be done (slow).
 *    Note: this is done per batch
 * @param options.batchSize - Number of lines to read into the buffer at once. Modify this to change performance.
 * @example
 * ```
 * >>> const readStream = new Stream.Readable({read(){}});
 * >>> readStream.push(`${JSON.stringify({a: 1, b: 2})} \n`);
 * >>> readStream.push(`${JSON.stringify({a: 2, b: 2})} \n`);
 * >>> readStream.push(`${JSON.stringify({a: 3, b: 2})} \n`);
 * >>> readStream.push(`${JSON.stringify({a: 4, b: 2})} \n`);
 * >>> readStream.push(null);
 *
 * >>> pl.readJSONStream(readStream).then(df => console.log(df));
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
export function readJSONStream(
    stream: Readable,
    options?: Partial<ReadJsonOptions>,
  ): Promise<DataFrame>;
  export function readJSONStream(stream, options = readJsonDefaultOptions) {
    options = { ...readJsonDefaultOptions, ...options };
  
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
  
      stream
        .pipe(new LineBatcher({ batchSize: options.batchSize }))
        .on("data", (chunk) => {
          try {
            const df = _DataFrame(pli.readJson(chunk, options));
            chunks.push(df);
          } catch (err) {
            reject(err);
          }
        })
        .on("end", () => {
          try {
            const df = concat(chunks);
            resolve(df);
          } catch (err) {
            reject(err);
          }
        });
    });
  }
