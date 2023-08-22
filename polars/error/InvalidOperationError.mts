export class InvalidOperationError extends RangeError {
    constructor(method, dtype) {
        super(`Invalid operation: ${method} is not supported for ${dtype}`);
    }
}

