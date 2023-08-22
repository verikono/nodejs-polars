import { type IConfig } from './index.mjs';
import { toggleStringCache } from 'nodejs-polars/internals';

/**
 * @ignore
 */
export const Config: IConfig = {

    setUtf8Tables() {
        process.env["POLARS_FMT_NO_UTF8"] = undefined;
        return this;
    },
    setAsciiTables() {
        process.env["POLARS_FMT_NO_UTF8"] = "1";
        return this;
    },
    setTblWidthChars(width) {
        process.env["POLARS_TABLE_WIDTH"] = String(width);
        return this;
    },
    setTblRows(n) {
        process.env["POLARS_FMT_MAX_ROWS"] = String(n);
        return this;
    },
    setTblCols(n) {
        process.env["POLARS_FMT_MAX_COLS"] = String(n);
        return this;
    },
    setGlobalStringCache() {
        pli.toggleStringCache(true);
        return this;
    },
    unsetGlobalStringCache() {
        pli.toggleStringCache(false);

        return this;
    },
};
