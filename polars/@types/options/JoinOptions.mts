import { type JoinType } from 'nodejs-polars/types';



/**
 * options for join operations @see {@link DataFrame.join}
 */
export interface JoinOptions {
    /** left join column */
    leftOn?: string | Array<string>;
    /** right join column */
    rightOn?: string | Array<string>;
    /** left and right join column */
    on?: string | Array<string>;
    /** join type */
    how?: JoinType;
    suffix?: string;
}
