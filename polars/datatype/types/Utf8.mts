import { PLRDataType } from '../PLRDataType.mjs';


export class Utf8 extends PLRDataType {

    constructor() {
        super();
    }

}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        expect,
    } = import.meta.vitest;


    describe("nodejs-polars/datatype/types.Utf8", () => {

        let instance:Utf8;

        beforeAll(async () => {
            instance = new Utf8();
        });

        test("cleanly instantiates", () => expect(instance).toBeInstanceOf(Utf8));

    });

}
