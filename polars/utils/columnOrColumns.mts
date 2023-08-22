import {
    type ColumnSelection,
    columnOrColumnsStrict,
} from './index.mjs';



/** @ignore */
export function columnOrColumns( columns: ColumnSelection | string | Array<string> | undefined ): Array<string> | undefined {
    if (columns) {
        return columnOrColumnsStrict(columns);
    }
}


