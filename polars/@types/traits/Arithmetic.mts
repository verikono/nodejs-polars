/**
 * Arithmetic operations
 */
export interface Arithmetic<T> {

    /**
     * Add self to other
     * @category Arithmetic
     */
    add(other: any): T;

    /**
     * Subtract other from self
     * @category Arithmetic
     */
    sub(other: any): T;

    /**
     * Divide self by other
     * @category Arithmetic
     */
    div(other: any): T;

    /**
     * Multiply self by other
     * @category Arithmetic
     */
    mul(other: any): T;

    /**
     * Get the remainder of self divided by other
     * @category Arithmetic
     */
    rem(other: any): T;

    /**
     * Add self to other
     * @category Arithmetic
     */
    plus(other: any): T;

    /**
     * Subtract other from self
     * @category Arithmetic
     */
    minus(other: any): T;

    /**
     * Divide self by other
     * @category Arithmetic
     */
    divideBy(other: any): T;

    /**
     * Multiply self by other
     * @category Arithmetic
     */
    multiplyBy(other: any): T;

    /**
     * Get the remainder of self divided by other
     * @category Arithmetic
     */
    modulo(other: any): T;
}
