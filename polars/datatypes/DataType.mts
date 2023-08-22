import {
    Field,
    TimeUnit,
    types
} from 'nodejs-polars/datatypes';



export abstract class DataType {

    get variant() {
        return this.constructor.name.slice(1);
    }
    protected identity = "DataType";
    protected get inner(): null | any[] {
        return null;
    }
    equals(other: DataType): boolean {
        return (
            this.variant === other.variant &&
            this.inner === null &&
            other.inner === null
        );
    }

    /** Null type */
    public static get Null(): DataType {
        return new types._Null();
    }
    /** `true` and `false`. */
    public static get Bool(): DataType {
        return new types._Bool();
    }
    /** An `i8` */
    public static get Int8(): DataType {
        return new types._Int8();
    }
    /** An `i16` */
    public static get Int16(): DataType {
        return new types._Int16();
    }
    /** An `i32` */
    public static get Int32(): DataType {
        return new types._Int32();
    }
    /** An `i64` */
    public static get Int64(): DataType {
        return new types._Int64();
    }
    /** An `u8` */
    public static get UInt8(): DataType {
        return new types._UInt8();
    }
    /** An `u16` */
    public static get UInt16(): DataType {
        return new types._UInt16();
    }
    /** An `u32` */
    public static get UInt32(): DataType {
        return new types._UInt32();
    }
    /** An `u64` */
    public static get UInt64(): DataType {
        return new types._UInt64();
    }

    /** A `f32` */
    public static get Float32(): DataType {
        return new types._Float32();
    }
    /** A `f64` */
    public static get Float64(): DataType {
        return new types._Float64();
    }
    public static get Date(): DataType {
        return new types._Date();
    }

    /** Time of day type */
    public static get Time(): DataType {
        return new types._Time();
    }
    /** Type for wrapping arbitrary JS objects */
    public static get Object(): DataType {
        return new types._Object();
    }
    /** A categorical encoding of a set of strings  */
    public static get Categorical(): DataType {
        return new types._Categorical();
    }

    /**
     * Calendar date and time type
     * @param timeUnit any of 'ms' | 'ns' | 'us'
     * @param timeZone timezone string as defined by Intl.DateTimeFormat `America/New_York` for example.
     *
     */
    public static Datetime(timeUnit: TimeUnit, timeZone?): DataType;
    public static Datetime(timeUnit: "ms" | "ns" | "us", timeZone?): DataType;
    public static Datetime(
        timeUnit,
        timeZone: string | null | undefined = null,
    ): DataType {
        return new types._Datetime(timeUnit, timeZone as any);
    }
    /**
     * Nested list/array type
     *
     * @param inner The `DataType` of values within the list
     *
     */
    public static List(inner: DataType): DataType {
        return new types._List(inner);
    }
    /**
     * Struct type
     */
    public static Struct(fields: Field[]): DataType;
    public static Struct(fields: { [key: string]: DataType }): DataType;
    public static Struct(
        fields: Field[] | { [key: string]: DataType },
    ): DataType {
        return new types._Struct(fields);
    }
    /** A variable-length UTF-8 encoded string whose offsets are represented as `i64`. */
    public static get Utf8(): DataType {
        return new types._Utf8();
    }

    /** @todo: should return `${string}(${string}(${string}))|${string}(${string})`, but inner is an array. */
    toString():string {
        if (this.inner) {
            return `${this.identity}(${this.variant}(${this.inner}))`;
        } else {
            return `${this.identity}(${this.variant})`;
        }
    }

    toJSON() {
        const inner = (this as any).inner;

        if (inner) {
            return {
                [this.identity]: {
                    [this.variant]: inner[0],
                },
            };
        } else {
            return {
                [this.identity]: this.variant,
            };
        }
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
        return this.toJSON();
    }
    static from(obj): DataType {
        return null as any;
    }
}
