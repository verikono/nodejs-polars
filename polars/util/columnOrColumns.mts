import { type ColumnSelection } from 'nodejs-polars/types';
import { columnOrColumnsStrict } from 'nodejs-polars/util';



/** @ignore */
export function columnOrColumns( columns: ColumnSelection | string | Array<string> | undefined ): Array<string> | undefined {
    if (columns) {
        return columnOrColumnsStrict(columns);
    }
}




if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.columnOrColumns", () => {

        test("exports from nodejs-polars/util", async () => {
            const { columnOrColumns } = await import('nodejs-polars/util');
            expect(columnOrColumnsStrict).toBeTypeOf('function');
        });

    });

}
