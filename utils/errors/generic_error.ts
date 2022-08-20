export default class GenericError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
