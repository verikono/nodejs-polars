import { pli } from 'nodejs-polars/internals';

import {
    type ReadJsonOptions,
    readJsonDefaultOptions,
} from './index.mjs';

import {
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import { isPath } from 'nodejs-polars/utils';


/**
 * __Read a JSON file or string into a DataFrame.__
 *
 * @param pathOrBody - path or buffer or string
 *   - path: Path to a file or a file like string. Any valid filepath can be used. Example: `file.csv`.
 *   - body: String or buffer to be read as a CSV
 * @param options
 * @param options.inferSchemaLength -Maximum number of lines to read to infer schema. If set to 0, all columns will be read as pl.Utf8.
 *    If set to `null`, a full table scan will be done (slow).
 * @param options.jsonFormat - Either "lines" or "json"
 * @param options.batchSize - Number of lines to read into the buffer at once. Modify this to change performance.
 * @returns ({@link DataFrame})
 * @example
 * ```
 * const jsonString = `
 * {"a", 1, "b", "foo", "c": 3}
 * {"a": 2, "b": "bar", "c": 6}
 * `
 * > const df = pl.readJSON(jsonString)
 * > console.log(df)
 *   shape: (2, 3)
 * ╭─────┬─────┬─────╮
 * │ a   ┆ b   ┆ c   │
 * │ --- ┆ --- ┆ --- │
 * │ i64 ┆ str ┆ i64 │
 * ╞═════╪═════╪═════╡
 * │ 1   ┆ foo ┆ 3   │
 * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
 * │ 2   ┆ bar ┆ 6   │
 * ╰─────┴─────┴─────╯
 * ```
 */
export function readJSON( pathOrBody: string | Buffer, options?: Partial<ReadJsonOptions> ): DataFrame;
export function readJSON( pathOrBody, options: Partial<ReadJsonOptions> = readJsonDefaultOptions ) {

    options = { ...readJsonDefaultOptions, ...options };

    const method = options.format === "lines" ? pli.readJsonLines : pli.readJson;
    const extensions = [".ndjson", ".json", ".jsonl"];
    if (Buffer.isBuffer(pathOrBody)) {
      return _DataFrame(pli.readJson(pathOrBody, options));
    }
  
    if (typeof pathOrBody === "string") {
      const inline = !isPath(pathOrBody, extensions);
      if (inline) {
        return _DataFrame(method(Buffer.from(pathOrBody, "utf-8"), options));
      } else {
        return _DataFrame(method(pathOrBody, options));
      }
    } else {
      throw new Error("must supply either a path or body");
    }
  }
