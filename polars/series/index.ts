import pli from "../internals/polars_internal.mjs";
import { arrayToJsSeries } from "../internals/construction";
import { DataType, DTYPE_TO_FFINAME, Optional } from "../datatypes";
import { DataFrame, _DataFrame } from "../dataframe";
import { SeriesStringFunctions, StringNamespace } from "./string";
import { ListNamespace, SeriesListFunctions } from "./list";
import { SeriesDateFunctions } from "./datetime";
import { SeriesStructFunctions } from "./struct";
import { InvalidOperationError } from "../error";
import {
  Arithmetic,
  Comparison,
  Cumulative,
  Deserialize,
  Rolling,
  Round,
  Sample,
  Serialize,
} from "../shared_traits";
import { col } from "../lazy/functions";
import { InterpolationMethod, RankMethod } from "../types";


/**
 * A Series represents a single column in a polars DataFrame.
 */


export function _Series(_s: any): Series {
  const unwrap = (method: keyof any, ...args: any[]) => {
    return _s[method as any](...args);
  };
  const wrap = (method, ...args): Series => {
    return _Series(unwrap(method, ...args));
  };
  const dtypeWrap = (method: string, ...args: any[]) => {
    const dtype = _s.dtype;

    const dt = (DTYPE_TO_FFINAME as any)[dtype];
    const internalMethod = `series${method}${dt}`;

    return _Series(pli[internalMethod](_s, ...args));
  };

  const dtypeUnwrap = (method: string, ...args: any[]) => {
    const dtype = _s.dtype;

    const dt = (DTYPE_TO_FFINAME as any)[dtype];
    const internalMethod = `series${method}${dt}`;

    return pli[internalMethod](_s, ...args);
  };

  const expr_op = (method: string, ...args) => {
    return _Series(_s)
      .toFrame()
      .select(col(_s.name)[method](...args))
      .getColumn(_s.name);
  };

  const series = {
    _s,
    [inspect]() {
      return _s.toString();
    },
    *[Symbol.iterator]() {
      let start = 0;
      const len = _s.len();
      while (start < len) {
        const v = _s.getIdx(start);
        start++;
        yield v as any;
      }
    },
    toString() {
      return _s.toString();
    },
    serialize(format) {
      return _s.serialize(format);
    },
    [Symbol.toStringTag]() {
      return "Series";
    },
    get dtype(): DataType {
      return DataType.deserialize(_s.dtype);
    },
    get name() {
      return _s.name;
    },
    get length() {
      return _s.len();
    },
    get str() {
      return SeriesStringFunctions(_s);
    },
    get lst() {
      return SeriesListFunctions(_s);
    },
    get date() {
      return SeriesDateFunctions(_s);
    },
    get struct() {
      return SeriesStructFunctions(_s);
    },
    abs() {
      return wrap("abs");
    },
    add(field) {
      return dtypeWrap("Add", field);
    },
    alias(name: string) {
      const s = _s.clone();
      s.rename(name);

      return _Series(s);
    },
    append(other: Series) {
      _s.append(other.inner());
    },
    argMax() {
      return _s.argMax();
    },
    argMin() {
      return _s.argMin();
    },
    argSort(reverse: any = false, nullsLast = true, maintain_order = false) {
      if (typeof reverse === "boolean") {
        return _Series(_s.argsort(reverse, nullsLast, maintain_order, false));
      }

      return _Series(
        _s.argsort(
          reverse.reverse,
          reverse.nullsLast ?? nullsLast,
          reverse.maintain_order ?? maintain_order,
        ),
      );
    },
    argTrue() {
      return _Series(
        this.toFrame()
          ._df.lazy()
          .select([pli.argWhere(pli.col(this.name))])
          .collectSync()
          .column(this.name),
      );
    },
    argUnique() {
      return _Series(_s.argUnique());
    },
    as(name) {
      return this.alias(name);
    },
    bitand(other) {
      return _Series(_s.bitand(other._s));
    },
    bitor(other) {
      return _Series(_s.bitor(other._s));
    },
    bitxor(other) {
      return _Series(_s.bitxor(other._s));
    },
    cast(dtype, strict = false) {
      return _Series(_s.cast(dtype, strict));
    },
    chunkLengths() {
      return _s.chunkLengths();
    },
    clone() {
      return _Series(_s.clone());
    },
    concat(other) {
      const s = _s.clone();
      s.append(other.inner());

      return _Series(s);
    },
    cumCount(reverse?) {
      return expr_op("cumCount", reverse);
    },
    cumSum(reverse?) {
      return _Series(_s.cumsum(reverse));
    },
    cumMax(reverse?) {
      return _Series(_s.cummax(reverse));
    },
    cumMin(reverse?) {
      return _Series(_s.cummin(reverse));
    },
    cumProd(reverse?) {
      return _Series(_s.cumprod(reverse));
    },
    describe() {
      let s = this.clone();
      let stats = {};
      if (!this.length) {
        throw new RangeError("Series must contain at least one value");
      }
      if (this.isNumeric()) {
        s = s.cast(DataType.Float64);
        stats = {
          min: s.min(),
          max: s.max(),
          null_count: s.nullCount(),
          mean: s.mean(),
          count: s.len(),
        };
      } else if (s.isBoolean()) {
        stats = {
          sum: s.sum(),
          null_count: s.nullCount(),
          count: s.len(),
        };
      } else if (s.isUtf8()) {
        stats = {
          unique: s.nUnique(),
          null_count: s.nullCount(),
          count: s.len(),
        };
      } else {
        throw new InvalidOperationError("describe", s.dtype);
      }

      return DataFrame({
        statistic: Object.keys(stats),
        value: Object.values(stats),
      });
    },
    diff(n: any = 1, nullBehavior = "ignore") {
      return typeof n === "number"
        ? _Series(_s.diff(n, nullBehavior))
        : _Series(_s.diff(n?.n ?? 1, n.nullBehavior ?? nullBehavior));
    },
    div(field: Series) {
      return dtypeWrap("Div", field);
    },
    divideBy(field: Series) {
      return this.div(field);
    },
    dot(other: Series) {
      return wrap("dot", (other as any)._s) as any;
    },
    dropNulls() {
      return wrap("dropNulls");
    },
    eq(field) {
      return dtypeWrap("Eq", field);
    },
    equals(field: Series) {
      return this.eq(field);
    },
    explode() {
      return wrap("explode");
    },
    extend(value, n) {
      return wrap("extendConstant", value, n);
    },
    extendConstant(value, n) {
      return wrap("extendConstant", value, n);
    },
    fillNull(strategy) {
      return typeof strategy === "string"
        ? wrap("fillNull", strategy)
        : wrap("fillNull", strategy.strategy);
    },
    filter(predicate) {
      return Series.isSeries(predicate)
        ? wrap("filter", (predicate as any)._s)
        : wrap("filter", (SeriesConstructor("", predicate) as any)._s);
    },
    get(field) {
      return dtypeUnwrap("Get", field);
    },
    getIndex(idx) {
      return _s.getIdx(idx);
    },
    gt(field) {
      return dtypeWrap("Gt", field);
    },
    greaterThan(field) {
      return this.gt(field);
    },
    gtEq(field) {
      return dtypeWrap("GtEq", field);
    },
    greaterThanEquals(field) {
      return this.gtEq(field);
    },
    hash(obj: any = 0n, k1 = 1n, k2 = 2n, k3 = 3n) {
      if (typeof obj === "number" || typeof obj === "bigint") {
        return wrap("hash", BigInt(obj), BigInt(k1), BigInt(k2), BigInt(k3));
      }
      const o = { k0: obj, k1: k1, k2: k2, k3: k3, ...obj };

      return wrap(
        "hash",
        BigInt(o.k0),
        BigInt(o.k1),
        BigInt(o.k2),
        BigInt(o.k3),
      );
    },
    hasValidity() {
      return _s.hasValidity();
    },
    head(length = 5) {
      return wrap("head", length);
    },
    inner() {
      return _s;
    },
    interpolate() {
      return expr_op("interpolate");
    },
    isBoolean() {
      const dtype = this.dtype;

      return dtype.equals(DataType.Bool);
    },
    isDateTime() {
      const dtype = this.dtype;

      return [DataType.Date.variant, "Datetime"].includes(dtype.variant);
    },
    isDuplicated() {
      return wrap("isDuplicated");
    },
    isFinite() {
      const dtype = this.dtype;

      if (
        ![DataType.Float32.variant, DataType.Float64.variant].includes(
          dtype.variant,
        )
      ) {
        throw new InvalidOperationError("isFinite", dtype);
      } else {
        return wrap("isFinite");
      }
    },
    isFirst() {
      return wrap("isFirst");
    },
    isFloat() {
      const dtype = this.dtype;

      return [DataType.Float32.variant, DataType.Float64.variant].includes(
        dtype.variant,
      );
    },
    isIn(other) {
      return Series.isSeries(other)
        ? wrap("isIn", (other as any)._s)
        : wrap("isIn", (Series("", other) as any)._s);
    },
    isInfinite() {
      const dtype = this.dtype;

      if (
        ![DataType.Float32.variant, DataType.Float64.variant].includes(
          dtype.variant,
        )
      ) {
        throw new InvalidOperationError("isFinite", dtype);
      } else {
        return wrap("isInfinite");
      }
    },
    isNotNull() {
      return wrap("isNotNull");
    },
    isNull() {
      return wrap("isNull");
    },
    isNaN() {
      return wrap("isNan");
    },
    isNotNaN() {
      return wrap("isNotNan");
    },
    isNumeric() {
      const dtype = this.dtype;

      const numericTypes = [
        DataType.Int8.variant,
        DataType.Int16.variant,
        DataType.Int32.variant,
        DataType.Int64.variant,
        DataType.UInt8.variant,
        DataType.UInt16.variant,
        DataType.UInt32.variant,
        DataType.UInt64.variant,
        DataType.Float32.variant,
        DataType.Float64.variant,
      ];

      return numericTypes.includes(dtype.variant);
    },
    isUnique() {
      return wrap("isUnique");
    },
    isUtf8() {
      return this.dtype.equals(DataType.Utf8);
    },
    kurtosis(fisher: any = true, bias = true) {
      if (typeof fisher === "boolean") {
        return _s.kurtosis(fisher, bias);
      }
      const d = {
        fisher: true,
        bias,
        ...fisher,
      };

      return _s.kurtosis(d.fisher, d.bias);
    },
    len() {
      return this.length;
    },
    lt(field) {
      return dtypeWrap("Lt", field);
    },
    lessThan(field) {
      return dtypeWrap("Lt", field);
    },
    ltEq(field) {
      return dtypeWrap("LtEq", field);
    },
    lessThanEquals(field) {
      return dtypeWrap("LtEq", field);
    },
    limit(n = 10) {
      return wrap("limit", n);
    },
    max() {
      return _s.max() as any;
    },
    mean() {
      return _s.mean() as any;
    },
    median() {
      return _s.median() as any;
    },
    min() {
      return _s.min() as any;
    },
    mode() {
      return wrap("mode");
    },
    minus(other) {
      return dtypeWrap("Sub", other);
    },
    mul(other) {
      return dtypeWrap("Mul", other);
    },
    nChunks() {
      return _s.nChunks();
    },
    neq(other) {
      return dtypeWrap("Neq", other);
    },
    notEquals(other) {
      return this.neq(other);
    },
    nullCount() {
      return _s.nullCount();
    },
    nUnique() {
      return _s.nUnique();
    },
    peakMax() {
      return wrap("peakMax");
    },
    peakMin() {
      return wrap("peakMin");
    },
    plus(other) {
      return dtypeWrap("Add", other);
    },
    quantile(quantile, interpolation = "nearest") {
      return _s.quantile(quantile, interpolation);
    },
    rank(method = "average", reverse = false) {
      return wrap("rank", method, reverse);
    },
    rechunk(inPlace = false) {
      return wrap("rechunk", inPlace);
    },
    reinterpret(signed = true) {
      const dtype = this.dtype;
      if (
        [DataType.UInt64.variant, DataType.Int64.variant].includes(
          dtype.variant,
        )
      ) {
        return wrap("reinterpret", signed);
      } else {
        throw new InvalidOperationError("reinterpret", dtype);
      }
    },
    rem(field) {
      return dtypeWrap("Rem", field);
    },
    modulo(field) {
      return this.rem(field);
    },
    rename(obj: any, inPlace = false): any {
      if (obj?.inPlace ?? inPlace) {
        _s.rename(obj?.name ?? obj);
      } else {
        return this.alias(obj?.name ?? obj);
      }
    },

    rollingMax(...args) {
      return expr_op("rollingMax", ...args);
    },
    rollingMean(...args) {
      return expr_op("rollingMean", ...args);
    },
    rollingMin(...args) {
      return expr_op("rollingMin", ...args);
    },
    rollingSum(...args) {
      return expr_op("rollingSum", ...args);
    },
    rollingStd(...args) {
      return expr_op("rollingStd", ...args);
    },
    rollingVar(...args) {
      return expr_op("rollingVar", ...args);
    },
    rollingMedian(...args) {
      return expr_op("rollingMedian", ...args);
    },
    rollingQuantile(...args) {
      return expr_op("rollingQuantile", ...args);
    },
    rollingSkew(...args) {
      return expr_op("rollingSkew", ...args);
    },
    floor() {
      return wrap("floor");
    },
    ceil() {
      return wrap("ceil");
    },
    round(opt): any {
      if (this.isNumeric()) {
        if (typeof opt === "number") {
          return wrap("round", opt);
        } else {
          return wrap("round", opt.decimals);
        }
      } else {
        throw new InvalidOperationError("round", this.dtype);
      }
    },
    clip(...args) {
      return expr_op("clip", ...args);
    },
    setAtIdx(indices, value) {
      indices = Series.isSeries(indices)
        ? indices.cast(DataType.UInt32)
        : Series(indices);
      if (!Series.isSeries(value)) {
        if (!Array.isArray(value)) {
          value = [value];
        }
        value = Series(value);
      }

      if (indices.length > 0) {
        value = value.extendConstant(value[0], indices.length - 1);
      }
      _s.setAtIdx(indices._s, value._s);
    },
    set(mask, value) {
      mask = Series.isSeries(mask) ? mask : Series.from(mask);

      return dtypeWrap("SetWithMask", mask.inner(), value);
    },
    sample(opts?, frac?, withReplacement = false, seed?) {
      // rome-ignore lint/style/noArguments: <explanation>
      if (arguments.length === 0) {
        return wrap("sampleN", 1, withReplacement, false, seed);
      }
      if (opts?.n !== undefined || opts?.frac !== undefined) {
        return this.sample(opts.n, opts.frac, opts.withReplacement, seed);
      }
      if (typeof opts === "number") {
        return wrap("sampleN", opts, withReplacement, false, seed);
      }
      if (typeof frac === "number") {
        return wrap("sampleFrac", frac, withReplacement, false, seed);
      } else {
        throw new TypeError("must specify either 'frac' or 'n'");
      }
    },
    seriesEqual(other, nullEqual: any = true, strict = false) {
      return _s.seriesEqual(other._s, nullEqual, strict);
    },
    shift(periods = 1) {
      return wrap("shift", periods);
    },
    shiftAndFill(...args) {
      return expr_op("shiftAndFill", ...args);
    },
    shrinkToFit(inPlace?: boolean) {
      if (inPlace) {
        _s.shrinkToFit();
      } else {
        const s = this.clone();
        s.shrinkToFit();

        return s as any;
      }
    },
    skew(bias: any = true) {
      if (typeof bias === "boolean") {
        return _s.skew(bias) as any;
      }

      return _s.skew(bias?.bias ?? true) as any;
    },
    slice(offset, length?) {
      if (typeof offset === "number") {
        return wrap("slice", offset, length);
      }

      return wrap("slice", offset.offset, offset.length);
    },
    sort(reverse?) {
      if (typeof reverse === "boolean") {
        return wrap("sort", reverse);
      }

      return wrap("sort", reverse?.reverse ?? false);
    },
    sub(field) {
      return dtypeWrap("Sub", field);
    },
    sum() {
      return _s.sum() as any;
    },
    tail(length = 5) {
      return wrap("tail", length);
    },
    take(indices) {
      return wrap("take", indices);
    },
    takeEvery(n) {
      return wrap("takeEvery", n);
    },
    multiplyBy(field) {
      return this.mul(field);
    },
    toArray() {
      return _s.toArray();
    },
    toTypedArray() {
      if (!this.hasValidity()) {
        return _s.toTypedArray();
      } else {
        throw new Error("data contains nulls, unable to convert to TypedArray");
      }
    },
    toFrame() {
      return _DataFrame(new pli.JsDataFrame([_s]));
    },
    toBinary() {
      return _s.toBinary();
    },
    toJSON(...args: any[]) {
      // this is passed by `JSON.stringify` when calling `toJSON()`
      if (args[0] === "") {
        return _s.toJs();
      }

      return _s.serialize("json").toString();
    },
    toObject() {
      return _s.toJs();
    },
    unique(maintainOrder?) {
      if (maintainOrder) {
        return wrap("uniqueStable");
      } else {
        return wrap("unique");
      }
    },
    valueCounts() {
      return null as any;
    },
    values() {
      return this[Symbol.iterator]();
    },
    zipWith(mask, other) {
      return wrap("zipWith", mask._s, other._s);
    },
  };

  return new Proxy(series, {
    get: function (target, prop, receiver) {
      if (typeof prop !== "symbol" && !Number.isNaN(Number(prop))) {
        return target.get(Number(prop));
      } else {
        return Reflect.get(target, prop, receiver);
      }
    },
    set: function (series, prop, input): any {
      if (typeof prop !== "symbol" && !Number.isNaN(Number(prop))) {
        series.setAtIdx([Number(prop)], input);

        return true;
      }
    },
  });
}









