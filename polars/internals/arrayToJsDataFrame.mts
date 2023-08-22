export function arrayToJsDataFrame(data: any[], options?): any {
    const columns = options?.columns;
    let orient = options?.orient;

    let dataSeries: any[];

    if (!data.length) {
        dataSeries = [];
    } else if (data[0]?._s) {
        dataSeries = [];

        data.forEach((series: any, idx) => {
            if (!series.name) {
                series.rename(`column_${idx}`, true);
            }
            dataSeries.push(series._s);
        });
    } else if (data[0].constructor.name === "Object") {
        const df = pli.fromRows(data, options);

        if (columns) {
            df.columns = columns;
        }

        return df;
    } else if (Array.isArray(data[0])) {
        if (!orient && columns) {
            orient = columns.length === data.length ? "col" : "row";
        }

        if (orient === "row") {
            const df = pli.fromRows(data);
            if (columns) df.columns = columns;

            return df;
        } else {
            dataSeries = data.map((s, idx) => (Series(`column_${idx}`, s) as any)._s);
        }
    } else {
        dataSeries = [(Series("column_0", data) as any)._s];
    }
    dataSeries = handleColumnsArg(dataSeries, columns);

    return new pli.JsDataFrame(dataSeries);
}
