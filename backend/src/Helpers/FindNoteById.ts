import NoteChildType from "../interfaces/NoteChild";

const findNoteById = (noteArray: Array<NoteChildType>, id: string) => {
  return noteArray.findIndex((note) => note.noteId === id);
};
export default findNoteById;
