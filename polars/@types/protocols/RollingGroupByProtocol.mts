import {
    type ColumnsOrExpr,
} from 'nodejs-polars/types';

import {
    type DataFrame,
} from 'nodejs-polars/dataframe';


/** intermediate state of a rolling groupby */
export interface RollingGroupByProtocol {
    agg( column: ColumnsOrExpr, ...columns: ColumnsOrExpr[] ): DataFrame;
}
