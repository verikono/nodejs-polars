import {
    type TimeUnit,
    DataType
} from 'nodejs-polars/datatype';



/**
 * Datetime type
 */
export class _Datetime extends DataType {
    constructor(private timeUnit: TimeUnit, private timeZone?: string) {
        super();
    }
    override get inner() {
        return [this.timeUnit, this.timeZone];
    }

    override equals(other: DataType): boolean {
        if (other.variant === this.variant) {
            return (
                this.timeUnit === (other as _Datetime).timeUnit &&
                this.timeZone === (other as _Datetime).timeZone
            );
        } else {
            return false;
        }
    }
}
