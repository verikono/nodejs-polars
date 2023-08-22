export const isIterator = <T extends object = {}>(ty: any): ty is Iterable<T> => ty !== null && typeof ty[Symbol.iterator] === "function";
