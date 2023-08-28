
/**
 * Serializes object to desired format via [serde](https://serde.rs/)
 *
 * @param format [json](https://github.com/serde-rs/json) | [bincode](https://github.com/bincode-org/bincode)
 *
 */
export interface Serialize {
    serialize( format: "json" | "bincode" ):Buffer;
}
