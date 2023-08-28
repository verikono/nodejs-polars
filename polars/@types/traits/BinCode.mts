export interface Bincode<T> {
    (bincode: Uint8Array): T;
    getState(T): Uint8Array;
}
