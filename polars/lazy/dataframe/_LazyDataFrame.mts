/** @ignore */
export const _LazyDataFrame = (_ldf: any): LazyDataFrame => {
    const unwrap = (method: string, ...args: any[]) => {
      return _ldf[method as any](...args);
    };
    const wrap = (method, ...args): LazyDataFrame => {
      return _LazyDataFrame(unwrap(method, ...args));
    };
  
    return {
      _ldf,
      [inspect]() {
        return _ldf.describeOptimizedPlan();
      },
  
      get columns() {
        return _ldf.columns;
      },
      describePlan() {
        return _ldf.describePlan();
      },
      describeOptimizedPlan() {
        return _ldf.describeOptimizedPlan();
      },
      cache() {
        return _LazyDataFrame(_ldf.cache());
      },
      clone() {
        return _LazyDataFrame((_ldf as any).clone());
      },
      collectSync() {
        return _DataFrame(_ldf.collectSync());
      },
      collect() {
        return _ldf.collect().then(_DataFrame);
      },
      drop(...cols) {
        return _LazyDataFrame(_ldf.dropColumns(cols.flat(2)));
      },
      distinct(...args: any[]) {
        return _LazyDataFrame((_ldf.unique as any)(...args));
      },
      unique(opts: any = false, subset?, keep = "first") {
        const defaultOptions = {
          maintainOrder: false,
          keep: "first",
        };
  
        if (typeof opts === "boolean") {
          const o = { ...defaultOptions, maintainOrder: opts, subset, keep };
  
          return _LazyDataFrame(
            _ldf.unique(o.maintainOrder, o?.subset?.flat(2), o.keep),
          );
        }
  
        if (opts.subset) {
          opts.subset = [opts.subset].flat(3);
        }
        const o = { ...defaultOptions, ...opts };
  
        return _LazyDataFrame(_ldf.unique(o.maintainOrder, o.subset, o.keep));
      },
      dropNulls(...subset) {
        if (subset.length) {
          return wrap("dropNulls", subset.flat(2));
        } else {
          return wrap("dropNulls");
        }
      },
      explode(...columns) {
        if (!columns.length) {
          const cols = selectionToExprList(_ldf.columns, false);
  
          return wrap("explode", cols);
        }
        const column = selectionToExprList(columns, false);
  
        return wrap("explode", column);
      },
      fetchSync(numRows, opts?) {
        if (opts?.noOptimization) {
          opts.predicatePushdown = false;
          opts.projectionPushdown = false;
        }
        if (opts) {
          _ldf = _ldf.optimizationToggle(
            opts.typeCoercion,
            opts.predicatePushdown,
            opts.projectionPushdown,
            opts.simplifyExpr,
            opts.stringCache,
            opts.slicePushdown,
          );
        }
  
        return _DataFrame(_ldf.fetchSync(numRows));
      },
      fetch(numRows, opts?) {
        if (opts?.noOptimization) {
          opts.predicatePushdown = false;
          opts.projectionPushdown = false;
        }
        if (opts) {
          _ldf = _ldf.optimizationToggle(
            opts.typeCoercion,
            opts.predicatePushdown,
            opts.projectionPushdown,
            opts.simplifyExpr,
            opts.stringCache,
            opts.slicePushdown,
          );
        }
  
        return _ldf.fetch(numRows).then(_DataFrame);
      },
      first() {
        return this.fetchSync(1);
      },
      fillNull(exprOrValue) {
        const fillValue = exprToLitOrExpr(exprOrValue)._expr;
  
        return _LazyDataFrame(_ldf.fillNull(fillValue));
      },
      filter(exprOrValue) {
        const predicate = exprToLitOrExpr(exprOrValue, false)._expr;
  
        return _LazyDataFrame(_ldf.filter(predicate));
      },
      groupBy(opt, maintainOrder: any = true): LazyGroupBy {
        if (opt?.by !== undefined) {
          const by = selectionToExprList([opt.by], false);
  
          return _LazyGroupBy(_ldf.groupby(by, opt.maintainOrder));
        }
        const by = selectionToExprList([opt], false);
  
        return _LazyGroupBy(_ldf.groupby(by, maintainOrder));
      },
      groupByRolling({ indexColumn, by, period, offset, closed, check_sorted }) {
        offset = offset ?? `-${period}`;
        closed = closed ?? "right";
        by = prepareGroupbyInputs(by);
        check_sorted = check_sorted ?? false;
        const lgb = _ldf.groupbyRolling(
          pli.col(indexColumn),
          period,
          offset,
          closed,
          by,
          check_sorted,
        );
  
        return _LazyGroupBy(lgb);
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
        start_by,
        check_sorted,
      }) {
        period = period ?? every;
        offset = offset ?? `-${period}`;
        closed = closed ?? "right";
        by = prepareGroupbyInputs(by);
        truncate = truncate ?? true;
        includeBoundaries = includeBoundaries ?? false;
        start_by = start_by ?? "monday";
        check_sorted = check_sorted ?? false;
  
        const lgb = _ldf.groupbyDynamic(
          pli.col(indexColumn),
          every,
          period,
          offset,
          truncate,
          includeBoundaries,
          closed,
          by,
          start_by,
          check_sorted,
        );
  
        return _LazyGroupBy(lgb);
      },
      head(len = 5) {
        return _LazyDataFrame(_ldf.slice(0, len));
      },
      join(df, options) {
        options = {
          how: "inner",
          suffix: "right",
          allowParallel: true,
          forceParallel: false,
          ...options,
        };
        const { how, suffix, allowParallel, forceParallel } = options;
        if (how === "cross") {
          return _LazyDataFrame(
            _ldf.join(
              df._ldf,
              [],
              [],
              allowParallel,
              forceParallel,
              how,
              suffix,
              [],
              [],
            ),
          );
        }
        let leftOn;
        let rightOn;
        if (options.on) {
          const on = selectionToExprList(options.on, false);
          leftOn = on;
          rightOn = on;
        } else if (
          (options.leftOn && !options.rightOn) ||
          (options.rightOn && !options.leftOn)
        ) {
          throw new TypeError(
            "You should pass the column to join on as an argument.",
          );
        } else {
          leftOn = selectionToExprList(options.leftOn, false);
          rightOn = selectionToExprList(options.rightOn, false);
        }
  
        const ldf = (_ldf.join as any)(
          df._ldf,
          leftOn,
          rightOn,
          allowParallel,
          forceParallel,
          how,
          suffix,
          [],
          [],
        );
  
        return _LazyDataFrame(ldf);
      },
      joinAsof(other, options) {
        options = {
          suffix: "_right",
          allowParallel: true,
          forceParallel: false,
          strategy: "backward",
          ...options,
        };
        const { suffix, strategy, allowParallel, forceParallel } = options;
        let leftOn;
        let rightOn;
        if (!other?._ldf) {
          throw new TypeError("Expected a 'lazyFrame' as join table");
        }
        if (options.on) {
          leftOn = rightOn = options.on;
        } else if (
          (options.leftOn && !options.rightOn) ||
          (options.rightOn && !options.leftOn)
        ) {
          throw new TypeError(
            "You should pass the column to join on as an argument.",
          );
        } else {
          leftOn = options.leftOn;
          rightOn = options.rightOn;
        }
        let byLeft;
        if (typeof options.byLeft === "string") {
          byLeft = [options.byLeft];
        } else if (Array.isArray(options.byLeft)) {
          byLeft = options.byLeft;
        }
        let byRight;
        if (typeof options.byRight === "string") {
          byRight = [options.byRight];
        } else if (Array.isArray(options.byRight)) {
          byRight = options.byRight;
        }
  
        if (typeof options.by === "string") {
          byLeft = byRight = [options.by];
        } else if (Array.isArray(options.by)) {
          byLeft = byRight = options.by;
        }
        let toleranceStr;
        let toleranceNum;
        if (typeof options.tolerance === "string") {
          toleranceStr = options.tolerance;
        } else {
          toleranceNum = options.tolerance;
        }
  
        const ldf = _ldf.joinAsof(
          other._ldf,
          pli.col(leftOn),
          pli.col(rightOn),
          byLeft,
          byRight,
          allowParallel,
          forceParallel,
          suffix,
          strategy,
          toleranceNum,
          toleranceStr,
        );
  
        return _LazyDataFrame(ldf);
      },
      last() {
        return _LazyDataFrame(_ldf.tail(1));
      },
      limit(len = 5) {
        return _LazyDataFrame(_ldf.slice(0, len));
      },
      max() {
        return _LazyDataFrame(_ldf.max());
      },
      mean() {
        return _LazyDataFrame(_ldf.mean());
      },
      median() {
        return _LazyDataFrame(_ldf.median());
      },
      melt(ids, values) {
        return _LazyDataFrame(
          _ldf.melt(columnOrColumnsStrict(ids), columnOrColumnsStrict(values)),
        );
      },
      min() {
        return _LazyDataFrame(_ldf.min());
      },
      quantile(quantile, interpolation = "nearest") {
        return _LazyDataFrame(_ldf.quantile(quantile, interpolation));
      },
      rename(mapping) {
        const existing = Object.keys(mapping);
        const replacements = Object.values(mapping);
  
        return _LazyDataFrame(_ldf.rename(existing, replacements));
      },
      reverse() {
        return _LazyDataFrame(_ldf.reverse());
      },
      select(...exprs) {
        const selections = selectionToExprList(exprs, false);
  
        return _LazyDataFrame(_ldf.select(selections));
      },
      shift(periods) {
        return _LazyDataFrame(_ldf.shift(periods));
      },
      shiftAndFill(optOrPeriods, fillValue?) {
        if (typeof optOrPeriods === "number") {
          fillValue = exprToLitOrExpr(fillValue)._expr;
  
          return _LazyDataFrame(_ldf.shiftAndFill(optOrPeriods, fillValue));
        } else {
          fillValue = exprToLitOrExpr(optOrPeriods.fillValue)._expr;
          const periods = optOrPeriods.periods;
  
          return _LazyDataFrame(_ldf.shiftAndFill(periods, fillValue));
        }
      },
      slice(opt, len?) {
        if (opt?.offset !== undefined) {
          return _LazyDataFrame(_ldf.slice(opt.offset, opt.length));
        }
  
        return _LazyDataFrame(_ldf.slice(opt, len));
      },
      sort(arg, descending = false, maintain_order = false) {
        if (arg?.by !== undefined) {
          return this.sort(arg.by, arg.descending, arg.maintain_order);
        }
        if (typeof arg === "string") {
          return wrap("sort", arg, descending, maintain_order, true, false);
        } else {
          descending = [descending].flat(3) as any;
          const by = selectionToExprList(arg, false);
  
          return wrap("sortByExprs", by, descending, maintain_order, true);
        }
      },
      std() {
        return _LazyDataFrame(_ldf.std());
      },
      sum() {
        return _LazyDataFrame(_ldf.sum());
      },
      var() {
        return _LazyDataFrame(_ldf.var());
      },
      tail(length = 5) {
        return _LazyDataFrame(_ldf.tail(length));
      },
      toJSON(...args: any[]) {
        // this is passed by `JSON.stringify` when calling `toJSON()`
        if (args[0] === "") {
          return JSON.parse(_ldf.serialize("json").toString());
        }
  
        return _ldf.serialize("json").toString();
      },
      serialize(format) {
        return _ldf.serialize(format);
      },
      withColumn(expr) {
        return _LazyDataFrame(_ldf.withColumn(expr._expr));
      },
      withColumns(...columns) {
        const exprs = selectionToExprList(columns, false);
  
        return _LazyDataFrame(_ldf.withColumns(exprs));
      },
      withColumnRenamed(existing, replacement) {
        return _LazyDataFrame(_ldf.rename([existing], [replacement]));
      },
      withRowCount(name = "row_nr") {
        return _LazyDataFrame(_ldf.withRowCount(name));
      },
    };
  };
