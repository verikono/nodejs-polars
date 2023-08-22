/**
 * Configure polars; offers options for table formatting and more.
 */
export interface IConfig {
    /** Use utf8 characters to print tables */
    setUtf8Tables(): IConfig;
    /** Use ascii characters to print tables */
    setAsciiTables(): IConfig;
    /** Set the number of character used to draw the table */
    setTblWidthChars(width: number): IConfig;
    /** Set the number of rows used to print tables */
    setTblRows(n: number): IConfig;
    /** Set the number of columns used to print tables */
    setTblCols(n: number): IConfig;
    /** Turn on the global string cache */
    setGlobalStringCache(): IConfig;
    /** Turn off the global string cache */
    unsetGlobalStringCache(): IConfig;
}
