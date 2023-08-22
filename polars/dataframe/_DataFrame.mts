/**
 * @ignore
 */
export const _DataFrame = (_df: any): DataFrame => {
    const unwrap = (method: string, ...args: any[]) => {
        return _df[method as any](...args);
    };
    const wrap = (method, ...args): DataFrame => {
        return _DataFrame(unwrap(method, ...args));
    };

    const df = {
        /** @ignore */
        _df,
        [inspect]() {
            return _df.toString();
        },
        *[Symbol.iterator]() {
            let start = 0;
            const len = this.width;

            while (start < len) {
                const s = this.toSeries(start);
                start++;
                yield s;
            }
        },
        get [Symbol.toStringTag]() {
            return "DataFrame";
        },
        get dtypes() {
            return _df.dtypes().map(DataType.deserialize);
        },
        get height() {
            return _df.height;
        },
        get width() {
            return _df.width;
        },
        get shape() {
            return _df.shape;
        },
        get columns() {
            return _df.columns;
        },
        set columns(names) {
            _df.columns = names;
        },
        get schema() {
            return this.getColumns().reduce((acc, curr) => {
                acc[curr.name] = curr.dtype;

                return acc;
            }, {});
        },
        clone() {
            return wrap("clone");
        },
        describe() {
            const describeCast = (df: DataFrame) => {
                return DataFrame(
                    df.getColumns().map((s) => {
                        if (s.isNumeric() || s.isBoolean()) {
                            return s.cast(DataType.Float64);
                        } else {
                            return s;
                        }
                    }),
                );
            };
            const summary = concat([
                describeCast(this.mean()),
                describeCast(this.std()),
                describeCast(this.min()),
                describeCast(this.max()),
                describeCast(this.median()),
            ]);
            summary.insertAtIdx(
                0,
                Series("describe", ["mean", "std", "min", "max", "median"]),
            );

            return summary;
        },
        inner() {
            return _df;
        },
        drop(...names) {
            if (!Array.isArray(names[0]) && names.length === 1) {
                return wrap("drop", names[0]);
            }

            const df: any = this.clone();

            names.flat(2).forEach((name) => {
                df.inner().dropInPlace(name);
            });

            return df;
        },
        dropNulls(...subset) {
            if (subset.length) {
                return wrap("dropNulls", subset.flat(2));
            } else {
                return wrap("dropNulls");
            }
        },
        distinct(opts: any = false, subset?, keep = "first") {
            return this.unique(opts, subset);
        },
        unique(opts: any = false, subset?, keep = "first") {
            const defaultOptions = {
                maintainOrder: false,
                keep,
            };

            if (typeof opts === "boolean") {
                return wrap("unique", opts, subset, keep);
            }

            if (opts.subset) {
                opts.subset = [opts.subset].flat(3);
            }
            const o = { ...defaultOptions, ...opts };

            return wrap("unique", o.maintainOrder, o.subset, o.keep);
        },
        explode(...columns) {
            return _DataFrame(_df)
                .lazy()
                .explode(columns)
                .collectSync({ noOptimization: true });
        },
        extend(other) {
            return wrap("extend", (other as any).inner());
        },
        filter(predicate) {
            return this.lazy().filter(predicate).collectSync();
        },
        fillNull(strategy) {
            return wrap("fillNull", strategy);
        },
        findIdxByName(name) {
            return unwrap("findIdxByName", name);
        },
        fold(fn: (s1, s2) => Series) {
            if (this.width === 1) {
                return this.toSeries(0);
            }

            return this.getColumns().reduce((acc, curr) => fn(acc, curr));
        },
        frameEqual(other, nullEqual = true) {
            return unwrap("frameEqual", other._df, nullEqual);
        },
        getColumn(name) {
            return _Series(_df.column(name)) as any;
        },
        getColumns() {
            return _df.getColumns().map(_Series) as any;
        },
        groupBy(...by) {
            return _GroupBy(_df as any, columnOrColumnsStrict(by));
        },
        groupByRolling(opts) {
            return RollingGroupBy(
                _DataFrame(_df) as any,
                opts.indexColumn,
                opts.period,
                opts.offset,
                opts.closed,
                opts.by,
                opts.check_sorted,
            );
        },
        groupByDynamic({
            indexColumn,
            every,
            period,
            offset,
            truncate,
            includeBoundaries,
            closed,
            by,
        }) {
            return DynamicGroupBy(
                _DataFrame(_df) as any,
                indexColumn,
                every,
                period,
                offset,
                truncate,
                includeBoundaries,
                closed,
                by,
            );
        },
        hashRows(obj: any = 0n, k1 = 1n, k2 = 2n, k3 = 3n) {
            if (typeof obj === "number" || typeof obj === "bigint") {
                return _Series(
                    _df.hashRows(BigInt(obj), BigInt(k1), BigInt(k2), BigInt(k3)),
                );
            }
            const o = { k0: obj, k1: k1, k2: k2, k3: k3, ...obj };

            return _Series(
                _df.hashRows(BigInt(o.k0), BigInt(o.k1), BigInt(o.k2), BigInt(o.k3)),
            ) as any;
        },
        head(length = 5) {
            return wrap("head", length);
        },
        hstack(columns, inPlace = false) {
            if (!Array.isArray(columns)) {
                columns = columns.getColumns();
            }
            const method = inPlace ? "hstackMut" : "hstack";

            return wrap(
                method,
                columns.map((col) => col.inner()),
            );
        },
        insertAtIdx(idx, series) {
            _df.insertAtIdx(idx, series.inner());
        },
        interpolate() {
            return this.select(col("*").interpolate());
        },
        isDuplicated: () => _Series(_df.isDuplicated()) as any,
        isEmpty: () => _df.height === 0,
        isUnique: () => _Series(_df.isUnique()) as any,
        join(other: DataFrame, options): DataFrame {
            options = { how: "inner", suffix: "right", ...options };
            const on = columnOrColumns(options.on);
            const how = options.how;
            const suffix = options.suffix;
            if (how === "cross") {
                return _DataFrame(_df.join(other._df, [], [], how, suffix));
            }
            let leftOn = columnOrColumns(options.leftOn);
            let rightOn = columnOrColumns(options.rightOn);

            if (on) {
                leftOn = on;
                rightOn = on;
            }
            if ((leftOn && !rightOn) || (rightOn && !leftOn)) {
                throw new TypeError(
                    "You should pass the column to join on as an argument.",
                );
            }

            return wrap("join", other._df, leftOn, rightOn, how, suffix);
        },
        joinAsof(other, options) {
            return this.lazy()
                .joinAsof(other.lazy(), options as any)
                .collectSync();
        },
        lazy: () => _LazyDataFrame(_df.lazy()),
        limit: (length = 5) => wrap("head", length),
        max(axis = 0) {
            if (axis === 1) {
                return _Series(_df.hmax() as any) as any;
            } else {
                return wrap("max");
            }
        },
        mean(axis = 0, nullStrategy = "ignore") {
            if (axis === 1) {
                return _Series(_df.hmean(nullStrategy) as any) as any;
            }

            return wrap("mean");
        },
        median() {
            return wrap("median");
        },
        melt(ids, values) {
            return wrap("melt", columnOrColumns(ids), columnOrColumns(values));
        },
        min(axis = 0) {
            if (axis === 1) {
                return _Series(_df.hmin() as any) as any;
            } else {
                return wrap("min");
            }
        },
        nChunks() {
            return _df.nChunks();
        },
        nullCount() {
            return wrap("nullCount");
        },
        partitionBy(by, strict = false, includeKey?: boolean, mapFn = (df) => df) {
            by = Array.isArray(by) ? by : [by];
            return _df
                .partitionBy(by, strict, includeKey)
                .map((d) => mapFn(_DataFrame(d)));
        },
        pivot(values, options?) {
            let {
                values: values_,
                index,
                columns,
                maintainOrder = true,
                sortColumns = false,
                aggregateFunc = "first",
            } = options;
            values = values_ ?? values;
            values = typeof values === "string" ? [values] : values;
            index = typeof index === "string" ? [index] : index;
            columns = typeof columns === "string" ? [columns] : columns;

            let fn: Expr;
            if (Expr.isExpr(aggregateFunc)) {
                fn = aggregateFunc;
            } else {
                fn =
                    {
                        first: element().first(),
                        sum: element().sum(),
                        max: element().max(),
                        min: element().min(),
                        mean: element().mean(),
                        median: element().median(),
                        last: element().last(),
                        count: element().count(),
                    }[aggregateFunc] ??
                    new Error(`Unknown aggregate function ${aggregateFunc}`);
                if (fn instanceof Error) {
                    throw fn;
                }
            }

            return _DataFrame(
                _df.pivotExpr(values, index, columns, fn, maintainOrder, sortColumns),
            );
        },
        quantile(quantile, interpolation = "nearest") {
            return wrap("quantile", quantile, interpolation);
        },
        rechunk() {
            return wrap("rechunk");
        },
        rename(mapping) {
            const df = this.clone();
            Object.entries(mapping).forEach(([column, new_col]) => {
                (df as any).inner().rename(column, new_col);
            });

            return df;
        },
        replaceAtIdx(index, newColumn) {
            _df.replaceAtIdx(index, newColumn.inner());

            return this;
        },
        rows(callback?: any) {
            if (callback) {
                return _df.toRowsCb(callback);
            }

            return _df.toRows();
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

        select(...selection) {
            const hasExpr = selection.flat().some((s) => Expr.isExpr(s));
            if (hasExpr) {
                return _DataFrame(_df).lazy().select(selection).collectSync();
            } else {
                return wrap("select", columnOrColumnsStrict(selection as any));
            }
        },
        shift: (opt) => wrap("shift", opt?.periods ?? opt),
        shiftAndFill(periods: any, fillValue?) {
            return _DataFrame(_df)
                .lazy()
                .shiftAndFill(periods, fillValue)
                .collectSync();
        },
        shrinkToFit(inPlace: any = false): any {
            if (inPlace) {
                _df.shrinkToFit();
            } else {
                const d = this.clone() as any;
                d.inner().shrinkToFit();

                return d;
            }
        },
        slice(opts, length?) {
            if (typeof opts === "number") {
                return wrap("slice", opts, length);
            }

            return wrap("slice", opts.offset, opts.length);
        },
        sort(arg, descending = false, maintain_order = false) {
            if (arg?.by !== undefined) {
                return this.sort(arg.by, arg.descending);
            }
            if (Array.isArray(arg) || Expr.isExpr(arg)) {
                return _DataFrame(_df)
                    .lazy()
                    .sort(arg, descending, maintain_order)
                    .collectSync({ noOptimization: true, stringCache: false });
            }

            return wrap("sort", arg, descending, maintain_order, true, false);
        },
        std() {
            return wrap("std");
        },
        sum(axis = 0, nullStrategy = "ignore") {
            if (axis === 1) {
                return _Series(_df.hsum(nullStrategy) as any) as any;
            }

            return wrap("sum");
        },
        tail: (length = 5) => wrap("tail", length),
        serialize(format) {
            return _df.serialize(format);
        },
        toCSV(...args) {
            return this.writeCSV(...args);
        },
        writeCSV(dest?, options = {}) {
            if (dest instanceof Writable || typeof dest === "string") {
                return _df.writeCsv(dest, options) as any;
            }
            const buffers: Buffer[] = [];
            const writeStream = new Stream.Writable({
                write(chunk, _encoding, callback) {
                    buffers.push(chunk);
                    callback(null);
                },
            });
            _df.writeCsv(writeStream as any, dest ?? options);
            writeStream.end("");

            return Buffer.concat(buffers);
        },
        toRecords() {
            return _df.toObjects();
        },
        toJSON(...args: any[]) {
            // this is passed by `JSON.stringify` when calling `toJSON()`
            if (args[0] === "") {
                return _df.toJs();
            }

            return _df.serialize("json").toString();
        },
        toObject() {
            return this.getColumns().reduce((acc, curr) => {
                acc[curr.name] = curr.toArray();

                return acc;
            }, {});
        },
        writeJSON(dest?, options = { format: "lines" }) {
            if (dest instanceof Writable || typeof dest === "string") {
                return _df.writeJson(dest, options) as any;
            }
            const buffers: Buffer[] = [];
            const writeStream = new Stream.Writable({
                write(chunk, _encoding, callback) {
                    buffers.push(chunk);
                    callback(null);
                },
            });

            _df.writeJson(writeStream, { ...options, ...dest });
            writeStream.end("");

            return Buffer.concat(buffers);
        },
        toParquet(dest?, options?) {
            return this.writeParquet(dest, options);
        },
        writeParquet(dest?, options = { compression: "uncompressed" }) {
            if (dest instanceof Writable || typeof dest === "string") {
                return _df.writeParquet(dest, options.compression) as any;
            }
            const buffers: Buffer[] = [];
            const writeStream = new Stream.Writable({
                write(chunk, _encoding, callback) {
                    buffers.push(chunk);
                    callback(null);
                },
            });

            _df.writeParquet(writeStream, dest?.compression ?? options?.compression);
            writeStream.end("");

            return Buffer.concat(buffers);
        },
        writeAvro(dest?, options = { compression: "uncompressed" }) {
            if (dest instanceof Writable || typeof dest === "string") {
                return _df.writeAvro(dest, options.compression) as any;
            }
            const buffers: Buffer[] = [];
            const writeStream = new Stream.Writable({
                write(chunk, _encoding, callback) {
                    buffers.push(chunk);
                    callback(null);
                },
            });

            _df.writeAvro(writeStream, dest?.compression ?? options?.compression);
            writeStream.end("");

            return Buffer.concat(buffers);
        },
        toIPC(dest?, options?) {
            return this.writeIPC(dest, options);
        },
        writeIPC(dest?, options = { compression: "uncompressed" }) {
            if (dest instanceof Writable || typeof dest === "string") {
                return _df.writeIpc(dest, options.compression) as any;
            }
            const buffers: Buffer[] = [];
            const writeStream = new Stream.Writable({
                write(chunk, _encoding, callback) {
                    buffers.push(chunk);
                    callback(null);
                },
            });

            _df.writeIpc(writeStream, dest?.compression ?? options?.compression);
            writeStream.end("");

            return Buffer.concat(buffers);
        },
        toSeries: (index = 0) => _Series(_df.selectAtIdx(index) as any) as any,
        toStruct(name) {
            return _Series(_df.toStruct(name));
        },
        toString() {
            return _df.toString();
        },
        transpose(options?) {
            const includeHeader = options?.includeHeader ?? false;
            const headeName = options?.headerName ?? "column";
            const keep_names_as = includeHeader ? headeName : undefined;
            if (options?.columnNames) {
                function takeNItems(iterable: Iterable<string>, n) {
                    const result: Array<string> = [];
                    let i = 0;
                    for (const item of iterable) {
                        if (i >= n) {
                            break;
                        }
                        result.push(item);
                        i++;
                    }
                    return result;
                }
                options.columnNames = Array.isArray(options.columnNames)
                    ? options.columnNames.slice(this.height)
                    : takeNItems(options.columnNames, this.height);
            }
            if (!options?.columnNames) {
                return wrap("transpose", keep_names_as, undefined);
            } else {
                return wrap("transpose", keep_names_as, options.columnNames);
            }
        },
        unnest(names) {
            names = Array.isArray(names) ? names : [names];

            return _DataFrame(_df.unnest(names));
        },
        var() {
            return wrap("var");
        },
        map: (fn) => map(_DataFrame(_df), fn as any) as any,
        row(idx) {
            return _df.toRow(idx);
        },
        vstack: (other) => wrap("vstack", (other as any).inner()),
        withColumn(column: Series | Expr) {
            if (Series.isSeries(column)) {
                return wrap("withColumn", column.inner());
            } else {
                return this.withColumns(column);
            }
        },
        withColumns(...columns: (Expr | Series)[]) {
            if (isSeriesArray(columns)) {
                return columns.reduce(
                    (acc, curr) => acc.withColumn(curr),
                    _DataFrame(_df),
                );
            } else {
                return this.lazy()
                    .withColumns(columns)
                    .collectSync({ noOptimization: true, stringCache: false });
            }
        },
        withColumnRenamed(opt, replacement?) {
            if (typeof opt === "string") {
                return this.rename({ [opt]: replacement });
            } else {
                return this.rename({ [opt.existing]: opt.replacement });
            }
        },
        withRowCount(name = "row_nr") {
            return wrap("withRowCount", name);
        },
        where(predicate) {
            return this.filter(predicate);
        },

        add: (other) => wrap("add", prepareOtherArg(other).inner()),
        sub: (other) => wrap("sub", prepareOtherArg(other).inner()),
        div: (other) => wrap("div", prepareOtherArg(other).inner()),
        mul: (other) => wrap("mul", prepareOtherArg(other).inner()),
        rem: (other) => wrap("rem", prepareOtherArg(other).inner()),
        plus: (other) => wrap("add", prepareOtherArg(other).inner()),
        minus: (other) => wrap("sub", prepareOtherArg(other).inner()),
        divideBy: (other) => wrap("div", prepareOtherArg(other).inner()),
        multiplyBy: (other) => wrap("mul", prepareOtherArg(other).inner()),
        modulo: (other) => wrap("rem", prepareOtherArg(other).inner()),
    } as DataFrame;

    return new Proxy(df, {
        get(target: DataFrame, prop, receiver) {
            if (typeof prop === "string" && target.columns.includes(prop)) {
                return target.getColumn(prop);
            }
            if (typeof prop !== "symbol" && !Number.isNaN(Number(prop))) {
                return target.row(Number(prop));
            } else {
                return Reflect.get(target, prop, receiver);
            }
        },
        set(target: DataFrame, prop, receiver) {
            if (Series.isSeries(receiver)) {
                if (typeof prop === "string" && target.columns.includes(prop)) {
                    const idx = target.columns.indexOf(prop);
                    target.replaceAtIdx(idx, receiver.alias(prop));

                    return true;
                }
            }

            Reflect.set(target, prop, receiver);

            return true;
        },
        has(target, p) {
            return target.columns.includes(p as any);
        },
        ownKeys(target) {
            return target.columns as any;
        },
        getOwnPropertyDescriptor(target, prop) {
            return {
                configurable: true,
                enumerable: true,
                value: target.getColumn(prop as any),
            };
        },
    });
};
