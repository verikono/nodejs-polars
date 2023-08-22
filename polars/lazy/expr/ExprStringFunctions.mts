export const ExprStringFunctions = (_expr: any): StringNamespace => {
    const wrap = (method, ...args: any[]): Expr => {
        return _Expr(_expr[method](...args));
    };

    const handleDecode = (encoding, strict: boolean) => {
        switch (encoding) {
            case "hex":
                return wrap("strHexDecode", strict);
            case "base64":
                return wrap("strBase64Decode", strict);
            default:
                throw new RangeError("supported encodings are 'hex' and 'base64'");
        }
    };

    return {
        concat(delimiter: string) {
            return wrap("strConcat", delimiter);
        },
        contains(pat: string | RegExp) {
            return wrap("strContains", regexToString(pat), false);
        },
        decode(arg, strict = false) {
            if (typeof arg === "string") {
                return handleDecode(arg, strict);
            }

            return handleDecode(arg.encoding, arg.strict);
        },
        encode(encoding) {
            switch (encoding) {
                case "hex":
                    return wrap("strHexEncode");
                case "base64":
                    return wrap("strBase64Encode");
                default:
                    throw new RangeError("supported encodings are 'hex' and 'base64'");
            }
        },
        extract(pat: string | RegExp, groupIndex: number) {
            return wrap("strExtract", regexToString(pat), groupIndex);
        },
        jsonExtract(dtype?: DataType, inferSchemaLength?: number) {
            return wrap("strJsonExtract", dtype, inferSchemaLength);
        },
        jsonPathMatch(pat: string) {
            return wrap("strJsonPathMatch", pat);
        },
        lengths() {
            return wrap("strLengths");
        },
        lstrip() {
            return wrap("strLstrip");
        },
        replace(pat: RegExp, val: string) {
            return wrap("strReplace", regexToString(pat), val);
        },
        replaceAll(pat: RegExp, val: string) {
            return wrap("strReplaceAll", regexToString(pat), val);
        },
        rstrip() {
            return wrap("strRstrip");
        },
        padStart(length: number, fillChar: string) {
            return wrap("strPadStart", length, fillChar);
        },
        zFill(length: number) {
            return wrap("strZFill", length);
        },
        padEnd(length: number, fillChar: string) {
            return wrap("strPadEnd", length, fillChar);
        },
        slice(start: number, length?: number) {
            return wrap("strSlice", start, length);
        },
        split(by: string, options?) {
            const inclusive =
                typeof options === "boolean" ? options : options?.inclusive;

            return wrap("strSplit", by, inclusive);
        },
        strip() {
            return wrap("strStrip");
        },
        strptime(dtype, format?) {
            if (dtype.equals(DataType.Date)) {
                return wrap("strToDate", format, false, false, false);
            } else if (dtype.equals(DataType.Datetime("ms"))) {
                return wrap(
                    "strToDatetime",
                    format,
                    undefined,
                    undefined,
                    false,
                    false,
                    false,
                );
            } else {
                throw new Error(
                    `only "DataType.Date" and "DataType.Datetime" are supported`,
                );
            }
        },
        toLowerCase() {
            return wrap("strToLowercase");
        },
        toUpperCase() {
            return wrap("strToUppercase");
        },
    };
};
