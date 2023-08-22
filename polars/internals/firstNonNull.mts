/**
 * __finds the first non null value in the inputs__
 * ___
 * If the first value is an array
 * it will find the first scalar type in the array and return it wrapped into the array
 *
 * @example
 * ```
 * > const input = [null, [], [null, "a", "b"]]
 * > firstNonNull(input)
 * ["a"]
 * > const ints = [null, 1]
 * > firstNonNull(ints)
 * 1
 * ```
 */
export const firstNonNull = (arr: any[]): any => {
    const first = arr.find((x) => x !== null && x !== undefined);
    if (Array.isArray(first)) {
        return [firstNonNull(arr.flat())];
    }

    return first;
};
