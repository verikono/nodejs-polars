import { formatWithOptions } from 'node:util';
import { DataFrameClass } from '@polars/dataframe/DataFrameClass.mjs';
import {
    isExprArray,
} from 'nodejs-polars/util';
import {
    INSPECT_OPTS
} from 'nodejs-polars/internals';



export class GroupByClass {

    by: string[];
    data: unknown;
    maintainOrder: boolean = false;

    constructor( data: unknown, by: string[], maintainOrder = false ) {
        this.by = by;
        this.data = data;
        this.maintainOrder = maintainOrder;
    }

    public customInspect():string {
        return formatWithOptions(INSPECT_OPTS, "GroupBy {by: %O}", this.by);
    }

    public pivot(opts: { pivotCol: string; valuesCol: string } | string, valuesCol?: string ) {
        if( typeof opts === 'string' ) {
            if(valuesCol)
                return this.pivot({ pivotCol:opts, valuesCol });
            throw new Error("must specify both pivotCol and valuesCol");
        }

        // return new PivotOpts();
    }

    public agg( ...aggregates:unknown[] ): DataFrameClass {

        if(isExprArray(aggregates)) {
            aggregates = [aggregates].flat(2);
            return (
                new DataFrameClass(this.data)
                    .lazy()
                    .groupBy()
                    .agg(...aggregates)
                    .collectSync({ noOptimization: true })
            );
        }

        const pairs = Object.entries(aggregates[0]).flatMap(([key, values]) => {
            return [values].flat(2).map((v) => col(key)[v as any]());
        });


        return new DataFrameClass(this.data).lazy().groupBy(this.by, maintainOrder).agg(...pairs).collectSync({ noOptimization: true });

    }

}






if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/groupby.GroupByClass", () => {

        test("", async () => {
            expect(new GroupByClass("123", ["this", "that"]).agg("a", "b")).toBeTypeOf('function');
        });

    });

}
