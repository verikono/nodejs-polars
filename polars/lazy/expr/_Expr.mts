import {
    type Expr,
    exprToLitOrExpr,
} from './index.mjs';



/** @ignore */
export const _Expr = (_expr: any): Expr => {

    const unwrap = (method: string, ...args: any[]) => {
        return _expr[method as any](...args);
    };

    const wrap = (method, ...args): Expr => {
        return _Expr(unwrap(method, ...args));
    };

    const wrapExprArg = (method: string, lit = false) => (other: any) => {
        const expr = exprToLitOrExpr(other, lit).inner();
        return wrap(method, expr);
    };

    const rolling =
        (method: string) => (opts, weights?, minPeriods?, center?): Expr => {
            const windowSize =
                opts?.["windowSize"] ?? (typeof opts === "number" ? opts : null);
            if (windowSize === null) {
                throw new Error("window size is required");
            }
            const callOpts = {
                windowSize: `${windowSize}i`,
                weights: opts?.["weights"] ?? weights,
                minPeriods: opts?.["minPeriods"] ?? minPeriods ?? windowSize,
                center: opts?.["center"] ?? center ?? false,
            };

            return wrap(method, callOpts);
        };

    return {
        _expr,
        [Symbol.toStringTag]() {
            return "Expr";
        },
        [INSPECT_SYMBOL]() {
            return _expr.toString();
        },
        serialize(format): any {
            return _expr.serialize(format);
        },
        toString() {
            return _expr.toString();
        },
        toJSON(...args: any[]) {
            // this is passed by `JSON.stringify` when calling `toJSON()`
            if (args[0] === "") {
                return _expr.toJs();
            }

            return _expr.serialize("json").toString();
        },
        get str() {
            return str.ExprStringFunctions(_expr);
        },
        get lst() {
            return lst.ExprListFunctions(_expr);
        },
        get date() {
            return dt.ExprDateTimeFunctions(_expr);
        },
        get struct() {
            return struct.ExprStructFunctions(_expr);
        },
        abs() {
            return _Expr(_expr.abs());
        },
        aggGroups() {
            return _Expr(_expr.aggGroups());
        },
        alias(name) {
            return _Expr(_expr.alias(name));
        },
        inner() {
            return _expr;
        },
        and(other) {
            const expr = (exprToLitOrExpr(other, false) as any).inner();

            return _Expr(_expr.and(expr));
        },
        argMax() {
            return _Expr(_expr.argMax());
        },
        argMin() {
            return _Expr(_expr.argMin());
        },
        argSort(reverse: any = false, maintain_order?: boolean) {
            reverse = reverse?.reverse ?? reverse;
            maintain_order = reverse?.maintain_order ?? maintain_order;
            return _Expr(_expr.argSort(reverse, false, false, maintain_order));
        },
        argUnique() {
            return _Expr(_expr.argUnique());
        },
        as(name) {
            return _Expr(_expr.alias(name));
        },
        backwardFill() {
            return _Expr(_expr.backwardFill());
        },
        cast(dtype, strict = false) {
            return _Expr(_expr.cast(dtype, strict));
        },
        ceil() {
            return _Expr(_expr.ceil());
        },
        clip(arg, max?) {
            if (typeof arg === "number") {
                return _Expr(_expr.clip(arg, max));
            } else {
                return _Expr(_expr.clip(arg.min, arg.max));
            }
        },
        count() {
            return _Expr(_expr.count());
        },
        cumCount(reverse: any = false) {
            reverse = reverse?.reverse ?? reverse;

            return _Expr(_expr.cumcount(reverse?.reverse ?? reverse));
        },
        cumMax(reverse: any = false) {
            reverse = reverse?.reverse ?? reverse;

            return _Expr(_expr.cummax(reverse));
        },
        cumMin(reverse: any = false) {
            reverse = reverse?.reverse ?? reverse;

            return _Expr(_expr.cummin(reverse));
        },
        cumProd(reverse: any = false) {
            reverse = reverse?.reverse ?? reverse;

            return _Expr(_expr.cumprod(reverse));
        },
        cumSum(reverse: any = false) {
            reverse = reverse?.reverse ?? reverse;

            return _Expr(_expr.cumsum(reverse));
        },
        diff(n, nullBehavior = "ignore") {
            if (typeof n === "number") {
                return _Expr(_expr.diff(n, nullBehavior));
            } else {
                return _Expr(_expr.diff(n.n, n.nullBehavior));
            }
        },
        dot(other) {
            const expr = (exprToLitOrExpr(other, false) as any).inner();

            return _Expr(_expr.dot(expr));
        },
        exclude(...columns) {
            return _Expr(_expr.exclude(columns.flat(2)));
        },
        explode() {
            return _Expr(_expr.explode());
        },
        extend(o, n?) {
            if (n !== null && typeof n === "number") {
                return _Expr(_expr.extendConstant(o, n));
            }

            return _Expr(_expr.extendConstant(o.value, o.n));
        },
        extendConstant(o, n?) {
            if (n !== null && typeof n === "number") {
                return _Expr(_expr.extendConstant(o, n));
            }

            return _Expr(_expr.extendConstant(o.value, o.n));
        },
        fillNan(other) {
            const expr = (exprToLitOrExpr(other, true) as any).inner();

            return _Expr(_expr.fillNan(expr));
        },
        fillNull(fillValue) {
            if (
                ["backward", "forward", "mean", "min", "max", "zero", "one"].includes(
                    fillValue,
                )
            ) {
                return _Expr(_expr.fillNullWithStrategy(fillValue));
            }

            const expr = exprToLitOrExpr(fillValue).inner();

            return _Expr(_expr.fillNull(expr));
        },
        filter(predicate) {
            const expr = exprToLitOrExpr(predicate).inner();

            return _Expr(_expr.filter(expr));
        },
        first() {
            return _Expr(_expr.first());
        },
        flatten() {
            return _Expr(_expr.explode());
        },
        floor() {
            return _Expr(_expr.floor());
        },
        forwardFill() {
            return _Expr(_expr.forwardFill());
        },
        hash(obj: any = 0, k1 = 1, k2 = 2, k3 = 3) {
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
        head(length) {
            if (typeof length === "number") {
                return wrap("head", length);
            }

            return wrap("head", length.length);
        },
        interpolate(method: InterpolationMethod = "linear") {
            return _Expr(_expr.interpolate(method));
        },
        isDuplicated() {
            return _Expr(_expr.isDuplicated());
        },
        isFinite() {
            return _Expr(_expr.isFinite());
        },
        isInfinite() {
            return _Expr(_expr.isInfinite());
        },
        isFirst() {
            return _Expr(_expr.isFirst());
        },
        isNan() {
            return _Expr(_expr.isNan());
        },
        isNotNan() {
            return _Expr(_expr.isNotNan());
        },
        isNotNull() {
            return _Expr(_expr.isNotNull());
        },
        isNull() {
            return _Expr(_expr.isNull());
        },
        isUnique() {
            return _Expr(_expr.isUnique());
        },
        isIn(other) {
            if (Array.isArray(other)) {
                other = pli.lit(Series(other).inner());
            } else {
                other = exprToLitOrExpr(other, false).inner();
            }

            return wrap("isIn", other);
        },
        keepName() {
            return _Expr(_expr.keepName());
        },
        kurtosis(obj?, bias = true) {
            const fisher = obj?.["fisher"] ?? (typeof obj === "boolean" ? obj : true);
            bias = obj?.["bias"] ?? bias;

            return _Expr(_expr.kurtosis(fisher, bias));
        },
        last() {
            return _Expr(_expr.last());
        },
        list() {
            return _Expr(_expr.list());
        },
        lowerBound() {
            return _Expr(_expr.lowerBound());
        },
        max() {
            return _Expr(_expr.max());
        },
        mean() {
            return _Expr(_expr.mean());
        },
        median() {
            return _Expr(_expr.median());
        },
        min() {
            return _Expr(_expr.min());
        },
        mode() {
            return _Expr(_expr.mode());
        },
        not() {
            return _Expr(_expr.not());
        },
        nUnique() {
            return _Expr(_expr.nUnique());
        },
        or(other) {
            const expr = exprToLitOrExpr(other).inner();

            return _Expr(_expr.or(expr));
        },
        over(...exprs) {
            const partitionBy = selectionToExprList(exprs, false);

            return wrap("over", partitionBy);
        },
        pow(exponent) {
            return _Expr(_expr.pow(exponent?.exponent ?? exponent));
        },
        prefix(prefix) {
            return _Expr(_expr.prefix(prefix));
        },
        quantile(quantile, interpolation: InterpolationMethod = "nearest") {
            if (Expr.isExpr(quantile)) {
                quantile = quantile._expr;
            } else {
                quantile = pli.lit(quantile);
            }

            return _Expr(_expr.quantile(quantile, interpolation));
        },
        rank(method: any = "average", reverse = false) {
            return _Expr(
                _expr.rank(method?.method ?? method, method?.reverse ?? reverse),
            );
        },
        reinterpret(signed: any = true) {
            signed = signed?.signed ?? signed;

            return _Expr(_expr.reinterpret(signed));
        },
        repeatBy(expr) {
            const e = exprToLitOrExpr(expr, false)._expr;

            return _Expr(_expr.repeatBy(e));
        },
        reverse() {
            return _Expr(_expr.reverse());
        },
        rollingMax: rolling("rollingMax"),
        rollingMean: rolling("rollingMean"),
        rollingMin: rolling("rollingMin"),
        rollingSum: rolling("rollingSum"),
        rollingStd: rolling("rollingStd"),
        rollingVar: rolling("rollingVar"),
        rollingMedian: rolling("rollingMedian"),
        rollingQuantile(
            val,
            interpolation?,
            windowSize?,
            weights?,
            minPeriods?,
            center?,
            by?,
            closedWindow?,
        ) {
            if (typeof val === "number") {
                return wrap("rollingQuantile", {
                    windowSize: `${windowSize}i`,
                    weights,
                    minPeriods,
                    center,
                });
            }
            windowSize =
                val?.["windowSize"] ?? (typeof val === "number" ? val : null);
            if (windowSize === null) {
                throw new Error("window size is required");
            }
            return wrap(
                "rollingQuantile",
                val.quantile,
                val.interpolation ?? "nearest",
                `${windowSize}i`,
                val?.["weights"] ?? weights ?? null,
                val?.["minPeriods"] ?? minPeriods ?? windowSize,
                val?.["center"] ?? center ?? false,
                val?.["by"] ?? by,
                val?.["closedWindow"] ?? closedWindow ?? "left",
            );
        },
        rollingSkew(val, bias = true) {
            if (typeof val === "number") {
                return wrap("rollingSkew", val, bias);
            }

            return wrap("rollingSkew", val.windowSize, val.bias ?? bias);
        },
        round(decimals) {
            return _Expr(_expr.round(decimals?.decimals ?? decimals));
        },
        sample(opts?, frac?, withReplacement = false, seed?) {
            if (opts?.n !== undefined || opts?.frac !== undefined) {
                return (this as any).sample(
                    opts.n,
                    opts.frac,
                    opts.withReplacement,
                    seed,
                );
            }
            if (typeof opts === "number") {
                throw new Error("sample_n is not yet supported for expr");
            }
            if (typeof frac === "number") {
                return wrap("sampleFrac", frac, withReplacement, false, seed);
            } else {
                throw new TypeError("must specify either 'frac' or 'n'");
            }
        },
        shift(periods) {
            return _Expr(_expr.shift(periods));
        },
        shiftAndFill(optOrPeriods, fillValue?) {
            if (typeof optOrPeriods === "number") {
                fillValue = exprToLitOrExpr(fillValue).inner();

                return wrap("shiftAndFill", optOrPeriods, fillValue);
            } else {
                fillValue = exprToLitOrExpr(optOrPeriods.fillValue).inner();
                const periods = optOrPeriods.periods;

                return wrap("shiftAndFill", periods, fillValue);
            }
        },
        skew(bias) {
            return wrap("skew", bias?.bias ?? bias ?? true);
        },
        slice(arg, len?) {
            if (typeof arg === "number") {
                return wrap("slice", pli.lit(arg), pli.lit(len));
            }

            return wrap("slice", pli.lit(arg.offset), pli.lit(arg.length));
        },
        sort(reverse: any = false, nullsLast = false, maintain_order = false) {
            if (typeof reverse === "boolean") {
                return wrap("sortWith", reverse, nullsLast, false, maintain_order);
            }

            return wrap(
                "sortWith",
                reverse?.reverse ?? false,
                reverse?.nullsLast ?? nullsLast,
                false,
                reverse?.maintain_order ?? maintain_order,
            );
        },
        sortBy(arg, reverse = false) {
            if (arg?.by !== undefined) {
                return this.sortBy(arg.by, arg.reverse);
            }

            reverse = Array.isArray(reverse) ? reverse.flat() : ([reverse] as any);
            const by = selectionToExprList(arg, false);

            return wrap("sortBy", by, reverse);
        },
        std() {
            return _Expr(_expr.std());
        },
        suffix(suffix) {
            return _Expr(_expr.suffix(suffix));
        },
        sum() {
            return _Expr(_expr.sum());
        },
        tail(length) {
            return _Expr(_expr.tail(length));
        },

        take(indices) {
            if (Array.isArray(indices)) {
                indices = pli.lit(Series(indices).inner());
            } else {
                indices = indices.inner();
            }

            return wrap("take", indices);
        },
        takeEvery(n) {
            return _Expr(_expr.takeEvery(n));
        },
        unique(opt?) {
            if (opt) {
                return wrap("unique_stable");
            }

            return wrap("unique");
        },
        upperBound() {
            return _Expr(_expr.upperBound());
        },
        where(expr) {
            return this.filter(expr);
        },
        var() {
            return _Expr(_expr.var());
        },
        add: wrapExprArg("add"),
        sub: wrapExprArg("sub"),
        div: wrapExprArg("div"),
        mul: wrapExprArg("mul"),
        rem: wrapExprArg("rem"),

        plus: wrapExprArg("add"),
        minus: wrapExprArg("sub"),
        divideBy: wrapExprArg("div"),
        multiplyBy: wrapExprArg("mul"),
        modulo: wrapExprArg("rem"),

        eq: wrapExprArg("eq"),
        equals: wrapExprArg("eq"),
        gtEq: wrapExprArg("gtEq"),
        greaterThanEquals: wrapExprArg("gtEq"),
        gt: wrapExprArg("gt"),
        greaterThan: wrapExprArg("gt"),
        ltEq: wrapExprArg("ltEq"),
        lessThanEquals: wrapExprArg("ltEq"),
        lt: wrapExprArg("lt"),
        lessThan: wrapExprArg("lt"),
        neq: wrapExprArg("neq"),
        notEquals: wrapExprArg("neq"),
    } as Expr;
};
