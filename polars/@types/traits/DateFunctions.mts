/**
 * Functions that can be applied to a Date or Datetime column.
 */
export interface DateFunctions<T> {
    /**
     * Extract day from underlying Date representation.
     * Can be performed on Date and Datetime.
     *
     * Returns the day of month starting from 1.
     * The return value ranges from 1 to 31. (The last day of month differs by months.)
     * @returns day as pl.UInt32
     */
    day(): T;
    /**
     * Extract hour from underlying DateTime representation.
     * Can be performed on Datetime.
     *
     * Returns the hour number from 0 to 23.
     * @returns Hour as UInt32
     */
    hour(): T;
    /**
     * Extract minutes from underlying DateTime representation.
     * Can be performed on Datetime.
     *
     * Returns the minute number from 0 to 59.
     * @returns minute as UInt32
     */
    minute(): T;
    /**
     * Extract month from underlying Date representation.
     * Can be performed on Date and Datetime.
     *
     * Returns the month number starting from 1.
     * The return value ranges from 1 to 12.
     * @returns Month as UInt32
     */
    month(): T;
    /**
     * Extract seconds from underlying DateTime representation.
     * Can be performed on Datetime.
     *
     * Returns the number of nanoseconds since the whole non-leap second.
     * The range from 1,000,000,000 to 1,999,999,999 represents the leap second.
     * @returns Nanosecond as UInt32
     */
    nanosecond(): T;
    /**
     * Extract ordinal day from underlying Date representation.
     * Can be performed on Date and Datetime.
     *
     * Returns the day of year starting from 1.
     * The return value ranges from 1 to 366. (The last day of year differs by years.)
     * @returns Day as UInt32
     */
    ordinalDay(): T;
    /**
     * Extract seconds from underlying DateTime representation.
     * Can be performed on Datetime.
     *
     * Returns the second number from 0 to 59.
     * @returns Second as UInt32
     */
    second(): T;
    /**
     * Format Date/datetime with a formatting rule: See [chrono strftime/strptime](https://docs.rs/chrono/0.4.19/chrono/format/strftime/index.html).
     */
    strftime(fmt: string): T;
    /** Return timestamp in ms as Int64 type. */
    timestamp(): T;
    /**
     * Extract the week from the underlying Date representation.
     * Can be performed on Date and Datetime
     *
     * Returns the ISO week number starting from 1.
     * The return value ranges from 1 to 53. (The last week of year differs by years.)
     * @returns Week number as UInt32
     */
    week(): T;
    /**
     * Extract the week day from the underlying Date representation.
     * Can be performed on Date and Datetime.
     *
     * Returns the weekday number where monday = 0 and sunday = 6
     * @returns Week day as UInt32
     */
    weekday(): T;
    /**
     * Extract year from underlying Date representation.
     * Can be performed on Date and Datetime.
     *
     * Returns the year number in the calendar date.
     * @returns Year as Int32
     */
    year(): T;
}
