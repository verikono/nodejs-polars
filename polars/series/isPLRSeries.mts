import { PLRSeries } from 'nodejs-polars/series';


/** TypeGuard: PLRSeries */
export function isPLRSeries( value:unknown ):value is PLRSeries {
    if(value instanceof PLRSeries) {
        return true;
    }
    return false;
}
