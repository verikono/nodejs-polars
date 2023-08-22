import { DataType } from 'nodejs-polars/datatypes';



export class _List extends DataType {
    constructor(protected __inner: DataType) {
        super();
    }
    override get inner() {
        return [this.__inner];
    }
    override equals(other: DataType): boolean {
        if (other.variant === this.variant) {
            return this.inner[0].equals((other as _List).inner[0]);
        } else {
            return false;
        }
    }
}
