import GenericError from './generic_error';

export default class NoIdeaError extends GenericError {
    message: string;

    constructor(message: string) {
        super(500, message);
        this.message = message;
        this.name = 'I do not know what happened over here';
    }
}
