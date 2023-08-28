/**
 * De-serializes buffer via [serde](https://serde.rs/)
 * @param buf buffer to deserialize
 * @param format [json](https://github.com/serde-rs/json) | [bincode](https://github.com/bincode-org/bincode)
 *
 */
export declare interface Deserialize<T> {
    deserialize( buf: Buffer, format: "json" | "bincode" ):T;
}
