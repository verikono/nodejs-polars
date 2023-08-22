export const SeriesStructFunctions = (_s: any): SeriesStructFunctions => {
    return {
        get fields() {
            return _s.structFields();
        },
        toFrame() {
            return _DataFrame(_s.structToFrame());
        },
        field(name) {
            return DataFrame({})
                .select(_Expr(pli.lit(_s).structFieldByName(name)))
                .toSeries();
        },
        renameFields(names) {
            return DataFrame({})
                .select(_Expr(pli.lit(_s).structRenameFields(names)))
                .toSeries();
        },
    };
};
export const SeriesStringFunctions = (_s: any): StringNamespace => {
  const wrap = (method, ...args): any => {
    const ret = _s[method](...args);

    return _Series(ret);
  };

  const handleDecode = (encoding, strict) => {
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
      return _Series(_s)
        .toFrame()
        .select(col(_s.name).str.concat(delimiter).as(_s.name))
        .getColumn(_s.name);
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
      return wrap("strReplace", /^\s*/.source, "");
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
    replace(pat: RegExp, val: string) {
      return wrap("strReplace", regexToString(pat), val);
    },
    replaceAll(pat: RegExp, val: string) {
      return wrap("strReplaceAll", regexToString(pat), val);
    },
    rstrip() {
      return wrap("strReplace", /[ \t]+$/.source, "");
    },
    slice(start: number, length?: number) {
      return wrap("strSlice", start, length);
    },
    split(by: string, options?) {
      const inclusive =
        typeof options === "boolean" ? options : options?.inclusive;
      const s = _Series(_s);

      return s
        .toFrame()
        .select(col(s.name).str.split(by, inclusive).as(s.name))
        .getColumn(s.name);
    },
    strip() {
      const s = _Series(_s);

      return s
        .toFrame()
        .select(col(s.name).str.strip().as(s.name))
        .getColumn(s.name);
    },
    strptime(dtype, fmt?) {
      const s = _Series(_s);

      return s
        .toFrame()
        .select(col(s.name).str.strptime(dtype, fmt).as(s.name))
        .getColumn(s.name);
    },
    toLowerCase() {
      return wrap("strToLowercase");
    },
    toUpperCase() {
      return wrap("strToUppercase");
    },
  };
};
