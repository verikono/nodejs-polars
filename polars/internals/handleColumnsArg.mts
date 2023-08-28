import { Series } from 'nodejs-polars/series';



export function handleColumnsArg(data: any[], columns?: string[]) {
    if (!columns) {
        return data;
    } else {
        if (!data) {
            return columns.map((c) => (Series.from(c, []) as any)._s);
        } else if (data.length === columns.length) {
            columns.forEach((name, i) => {
                data[i].rename(name);
            });

            return data;
        }
    }
    throw new TypeError("Dimensions of columns arg must match data dimensions.");
}
