import { type JoinType } from 'nodejs-polars/types';

/** @ignore */
export type JoinBaseOptions = {
    how?: JoinType;
    suffix?: string;
};
