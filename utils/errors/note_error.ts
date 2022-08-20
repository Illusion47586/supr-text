import GenericError from './generic_error';

type NoteErrorCode = 401 | 403 | 404 | 410;

export default class NoteError extends GenericError {
    public code: NoteErrorCode;

    /**
     * @param id id of the note
     * @param code
     * * 401 - Different password
     * * 403 - Restricted
     * * 404 - Not found
     * * 410 - Expired / deleted
     */
    constructor(id: string, code: NoteErrorCode) {
        let message = `Note ${id} `;
        if (code === 404) message += 'not found.';
        else if (code === 401)
            message += 'requires a different password or is locked to a different ip.';
        else if (code === 403)
            message += "can't be opened because user is not authorized to do so.";
        else if (code === 410) message += 'was expired and thus has been deleted.';
        super(code, message);
        this.code = code;
        this.message = message;
    }
}
