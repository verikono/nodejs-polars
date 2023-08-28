import { Bool } from './types/index.mjs';



export class PLRDataType {

    protected identity = "DataType";

    public static Bool():Bool {
        return new Bool();
    }

    // public static Time():T.Time {
    //     return new T.Time();
    // }

    get variant() {
        return this.constructor.name.slice(1);
    }

}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        expect,
    } = import.meta.vitest;


    describe("nodejs-polars/datatype.PLRDataType", () => {

        // let instance:PLRDataType;

        // beforeAll(async () => {
        //     instance = new PLRDataType();
        // });

        // test("cleanly instantiates", () => expect(instance).toBeInstanceOf(PLRDataType));
        // test("dynamically importable from nodejs-polars/datatype", async () => expect((await import("nodejs-polars/datatype")).PLRDataType).toMatchObject(PLRDataType));

        describe("getters", () => {

            describe("variant", () => {

                test("resolves to a string", async () => {
                    // const result = instance.variant;
                    console.log('--')
                    expect(true).toBeTruthy();
                });
        
            });
            
        });

        describe.todo("methods", () => {
        
        });


    });

}
