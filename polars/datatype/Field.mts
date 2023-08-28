import {
  DataType,
} from "nodejs-polars/datatype";



export class Field implements Field {

  /** The field name */
  name: string;

  /** The Datatype this field is expected to be */
  dtype: DataType;

  /**
   * @public
   * @constructor
   * @param {string} name the common name of this field.
   * @param {DataType} dtype the datatype this field is expected to be.
   */
  constructor( name: string, dtype: DataType ) {
    this.name = name;
    this.dtype = dtype;
  }


  /** represent this class a a string (pretty print it basically.) */
  toString() {
    const { name, dtype } = this;
    return `Field("${name}", ${dtype})`;
  }


  /** toJSON handler for this field class. */
  toJSON() {
    const { name, dtype } = this;
    return { name, dtype };
  }


  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON();
  }


}


export namespace Field {

  export function from(name: string, dtype: DataType): Field;
  export function from([string, DataType]): Field;
  export function from(obj: { name: string; dtype: DataType }): Field;
  export function from(nameOrObj, dtype?: DataType): Field {
    if (typeof nameOrObj === "string" && dtype) {
      return new Field(nameOrObj, dtype);
    } else if (Array.isArray(nameOrObj)) {
      return new Field(nameOrObj[0], nameOrObj[1]);
    } else {
      return new Field(nameOrObj.name, nameOrObj.dtype);
    }
  }
}






if(import.meta.vitest) {

  const {
    beforeAll,
    describe,
    test,
    expect,
  } = import.meta.vitest;

  describe("nodejs-polars/datatypes.Field", () => {

    let TestField:typeof Field;

    beforeAll(async () => {
      const { Field } = await import('nodejs-polars/datatype');
      TestField = Field;
    })


    test("exports from /datatypes", () => expect(TestField).toMatchObject(Field));


    test("", async () => {
      const { Field:TestField } = await import('nodejs-polars/datatype');
      expect(TestField).toMatchObject(Field);
    });


  });

}
