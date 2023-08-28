
/** ConfigProtocolure polars; offers options for table formatting and more. */
export interface ConfigProtocol {

    /** Use utf8 characters to print tables */
    setUtf8Tables(): ConfigProtocol;

    /** Use ascii characters to print tables */
    setAsciiTables(): ConfigProtocol;

    /** Set the number of character used to draw the table */
    setTblWidthChars(width: number): ConfigProtocol;

    /** Set the number of rows used to print tables */
    setTblRows(n: number): ConfigProtocol;

    /** Set the number of columns used to print tables */
    setTblCols(n: number): ConfigProtocol;

    /** Turn on the global string cache */
    setGlobalStringCache(): ConfigProtocol;

    /** Turn off the global string cache */
    unsetGlobalStringCache(): ConfigProtocol;

}

