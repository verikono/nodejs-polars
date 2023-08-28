import { PLRDataType } from '../index.mjs';


export class Bool extends PLRDataType {

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


    describe("nodejs-polars/datatype/types.Bool", () => {

        let instance:Bool;

        beforeAll(async () => {
            instance = new Bool();
        });

        test("cleanly instantiates", () => expect(instance).toBeInstanceOf(Bool));

    });

}
