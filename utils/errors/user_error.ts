import GenericError from './generic_error';

type UserErrorCode = 404;

export default class UserError extends GenericError {
    public code: UserErrorCode;

    /**
     * @param id id of the User
     * @param code
     * * 404 - Not found
     */
    constructor(id: string, code: UserErrorCode) {
        let message = `User ${id} `;
        if (code === 404) message += 'not found.';
        super(code, message);
        this.code = code;
        this.message = message;
    }
}
