import { GroupByClass } from 'nodejs-polars/groupby';

export function GroupByFn( data:unknown, by:string[], maintainOrder = false ) {
    const instance = new GroupByClass(data, by, maintainOrder);
    return instance;
}
