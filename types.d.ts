declare global {
    interface User {
        name: string;
        email: string;
        token?: string;
        _id: string;
        notes: Schema.Types.ObjectId[];
    }

    interface Note {
        title?: string;
        fileType?: string;
        password?: string;
        content: string;
        code?: string;
        restricted?: string[];
        owner?: Schema.Types.ObjectId;
        showCreater?: boolean;
        encryptContentWhileSending?: boolean;
        remainingCalls?: number;
        immutable?: boolean;
    }

    module '*.md' {
        const value: string; // markdown is just a string
        export default value;
    }
}

export {};
