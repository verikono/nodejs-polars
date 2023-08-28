
export interface StringFunctions<T> {
    /**
     * Vertically concat the values in the Series to a single string value.
     * @example
     * ```
     * > df = pl.DataFrame({"foo": [1, null, 2]})
     * > df = df.select(pl.col("foo").str.concat("-"))
     * > df
     * shape: (1, 1)
     * ┌──────────┐
     * │ foo      │
     * │ ---      │
     * │ str      │
     * ╞══════════╡
     * │ 1-null-2 │
     * └──────────┘
     * ```
     */
    concat(delimiter: string): T;
    /** Check if strings in Series contain regex pattern. */
    contains(pat: string | RegExp): T;
    /**
     * Decodes a value using the provided encoding
     * @param encoding - hex | base64
     * @param strict - how to handle invalid inputs
     *
     *     - true: method will throw error if unable to decode a value
     *     - false: unhandled values will be replaced with `null`
     * @example
     * ```
     * > df = pl.DataFrame({"strings": ["666f6f", "626172", null]})
     * > df.select(col("strings").str.decode("hex"))
     * shape: (3, 1)
     * ┌─────────┐
     * │ strings │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ foo     │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ bar     │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * └─────────┘
     * ```
     */
    decode(encoding: "hex" | "base64", strict?: boolean): T;
    decode(options: { encoding: "hex" | "base64"; strict?: boolean }): T;
    /**
     * Encodes a value using the provided encoding
     * @param encoding - hex | base64
     * @example
     * ```
     * > df = pl.DataFrame({"strings", ["foo", "bar", null]})
     * > df.select(col("strings").str.encode("hex"))
     * shape: (3, 1)
     * ┌─────────┐
     * │ strings │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ 666f6f  │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ 626172  │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * └─────────┘
     * ```
     */
    encode(encoding: "hex" | "base64"): T;
    /**
     * Extract the target capture group from provided patterns.
     * @param pattern A valid regex pattern
     * @param groupIndex Index of the targeted capture group.
     * Group 0 mean the whole pattern, first group begin at index 1
     * Default to the first capture group
     * @returns Utf8 array. Contain null if original value is null or regex capture nothing.
     * @example
     * ```
     * >  df = pl.DataFrame({
     * ...   'a': [
     * ...       'http://vote.com/ballon_dor?candidate=messi&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidat=jorginho&ref=polars',
     * ...       'http://vote.com/ballon_dor?candidate=ronaldo&ref=polars'
     * ...   ]})
     * >  df.select(pl.col('a').str.extract(/candidate=(\w+)/, 1))
     * shape: (3, 1)
     * ┌─────────┐
     * │ a       │
     * │ ---     │
     * │ str     │
     * ╞═════════╡
     * │ messi   │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ null    │
     * ├╌╌╌╌╌╌╌╌╌┤
     * │ ronaldo │
     * └─────────┘
     * ```
     */
    extract(pat: string | RegExp, groupIndex: number): T;
    /**
     * Extract the first match of json string with provided JSONPath expression.
     * Throw errors if encounter invalid json strings.
     * All return value will be casted to Utf8 regardless of the original value.
     * @see https://goessner.net/articles/JsonPath/
     * @param jsonPath - A valid JSON path query string
     * @returns Utf8 array. Contain null if original value is null or the `jsonPath` return nothing.
     * @example
     * ```
     * > df = pl.DataFrame({
     * ...   'json_val': [
     * ...     '{"a":"1"}',
     * ...     null,
     * ...     '{"a":2}',
     * ...     '{"a":2.1}',
     * ...     '{"a":true}'
     * ...   ]
     * ... })
     * > df.select(pl.col('json_val').str.jsonPathMatch('$.a')
     * shape: (5,)
     * Series: 'json_val' [str]
     * [
     *     "1"
     *     null
     *     "2"
     *     "2.1"
     *     "true"
     * ]
     * ```
     */
    jsonPathMatch(pat: string): T;
    /**  Get length of the string values in the Series. */
    lengths(): T;
    /** Remove leading whitespace. */
    lstrip(): T;
    /** Replace first regex match with a string value. */
    replace(pat: string | RegExp, val: string): T;
    /** Replace all regex matches with a string value. */
    replaceAll(pat: string | RegExp, val: string): T;
    /** Modify the strings to their lowercase equivalent. */
    toLowerCase(): T;
    /** Modify the strings to their uppercase equivalent. */
    toUpperCase(): T;
    /** Remove trailing whitespace. */
    rstrip(): T;
    /**
     * Create subslices of the string values of a Utf8 Series.
     * @param start - Start of the slice (negative indexing may be used).
     * @param length - Optional length of the slice.
     */
    slice(start: number, length?: number): T;
    /**
     * Split a string into substrings using the specified separator and return them as a Series.
     * @param separator — A string that identifies character or characters to use in separating the string.
     * @param inclusive Include the split character/string in the results
     */
    split(by: string, options?: { inclusive?: boolean } | boolean): T;
    /** Remove leading and trailing whitespace. */
    strip(): T;
    /**
     * Parse a Series of dtype Utf8 to a Date/Datetime Series.
     * @param datatype Date or Datetime.
     * @param fmt formatting syntax. [Read more](https://docs.rs/chrono/0.4.19/chrono/format/strftime/index.html)
     */
    strptime(datatype: DataType.Date | DataType.Datetime, fmt?: string): T;
  }
  