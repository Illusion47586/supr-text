/* eslint-disable no-param-reassign */
import { WritableDraft } from 'immer/dist/internal';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface NotesState {
    notes: Map<string, Note>;
    current?: string;
    localLock: boolean;
    getNote: () => Note;
    updateNote: (updates: Partial<Note>) => void;
    changeNote: (note: Note) => void;
    changeCurrent: (id: string) => void;
    lock: () => void;
    unlock: () => void;
    // removeNote: (newNoteId?: string) => void;
}

const generateNewNote = (): Note => ({
    code: 'local',
    content: '',
});

type StoreSet = (fn: (draft: WritableDraft<NotesState>) => void) => void;

const useNoteStore = create<
    NotesState,
    [['zustand/immer', NotesState], ['zustand/persist', NotesState]]
>(
    // persist(
    immer((set: StoreSet, get) => ({
        notes: new Map<string, Note>(),
        current: undefined,
        localLock: false,
        getNote: () => {
            const { current: _current, notes } = get();
            if (!_current || !notes.has(_current)) {
                const newNote = generateNewNote();
                set((state) => {
                    state.notes.set(newNote.code!, newNote);
                    state.current = newNote.code;
                });
            }
            return notes.get(_current!)!;
        },
        updateNote: (updates) => {
            if (updates.password && updates.password.length === 0) delete updates.password;
            set((state) => {
                state.notes.set(state.current!, {
                    ...state.getNote(),
                    ...updates,
                } as Note);
            });
        },
        changeNote: (note: Note) => {
            set((state) => {
                state.notes.set(note.code!, note);
                state.current = note.code!;
                state.localLock = note.immutable === true;
            });
        },
        changeCurrent: (id) => {
            set((state) => {
                state.current = id;
            });
        },
        lock: () => {
            set((state) => {
                state.localLock = true;
            });
        },
        unlock: () => {
            set((state) => {
                state.localLock = false;
            });
        },
    })),
    //     {
    //         name: 'notes',
    //         getStorage: () => localStorage,
    //     },
    // ),
);

export default useNoteStore;
