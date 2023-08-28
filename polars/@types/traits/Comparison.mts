
export interface Comparison<T> {
    /**
     * Compare self to other: `self == other`
     * @category Comparison
     */
    eq(other: any): T;
    /**
     * Compare self to other: `self == other`
     * @category Comparison
     */
    equals(other: any): T;
    /**
     * Compare self to other:  `self >= other`
     * @category Comparison
     */
    gtEq(other: any): T;
    /**
     * Compare self to other:  `self >= other`
     * @category Comparison
     */
    greaterThanEquals(other: any): T;
    /**
     * Compare self to other:  `self > other`
     * @category Comparison
     */
    gt(other: any): T;
    /**
     * Compare self to other:  `self > other`
     * @category Comparison
     */
    greaterThan(other: any): T;
    /**
     * Compare self to other:  `self <= other`
     * @category Comparison
     */
    ltEq(other: any): T;
    /**
     * Compare self to other:  `self =< other`
     * @category Comparison
     */
    lessThanEquals(other: any): T;
    /**
     * Compare self to other:  `self < other`
     * @category Comparison
     */
    lt(other: any): T;
    /**
     * Compare self to other:  `self < other`
     * @category Comparison
     */
    lessThan(other: any): T;
    /**
     * Compare self to other:  `self !== other`
     * @category Comparison
     */
    neq(other: any): T;
    /**
     * Compare self to other:  `self !== other`
     * @category Comparison
     */
    notEquals(other: any): T;
}
