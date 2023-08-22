import {
    DataType,
    Field,
} from 'nodejs-polars/datatypes';



export class _Struct extends DataType {

    private fields: Field[];
  
    constructor(
      inner:
        | {
            [name: string]: DataType;
          }
        | Field[],
    ) {
      super();
      if (Array.isArray(inner)) {
        this.fields = inner;
      } else {
        this.fields = Object.entries(inner).map(Field.from);
      }
    }
    override get inner() {
      return this.fields;
    }
    override equals(other: DataType): boolean {
      if (other.variant === this.variant) {
        return this.inner
          .map((fld, idx) => {
            const otherfld = (other as _Struct).fields[idx];
  
            return otherfld.name === fld.name && otherfld.dtype.equals(fld.dtype);
          })
          .every((value) => value);
      } else {
        return false;
      }
    }
    override toJSON() {
      return {
        [this.identity]: {
          [this.variant]: this.fields,
        },
      } as any;
    }
  }
  
  