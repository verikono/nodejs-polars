/**
 * options for lazy operations @see {@link LazyDataFrame.collect}
 */
export type LazyOptions = {
    typeCoercion?: boolean;
    predicatePushdown?: boolean;
    projectionPushdown?: boolean;
    simplifyExpression?: boolean;
    stringCache?: boolean;
    noOptimization?: boolean;
};
