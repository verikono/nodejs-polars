/**
 * Datetime time unit
 */
export enum TimeUnit {
    Nanoseconds = "ns",
    Microseconds = "us",
    Milliseconds = "ms",
}

/**
 * @ignore
 * Timeunit namespace
 */
export namespace TimeUnit {
    export function from( s: "ms" | "ns" | "us" ): TimeUnit {
        return TimeUnit[s];
    }
}
