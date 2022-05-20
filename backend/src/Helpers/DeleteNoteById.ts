import NoteChildType from "../interfaces/NoteChild";
const deleteNoteById = (
  noteArray: Array<NoteChildType>,
  elementIndex: number
) => {
  return noteArray.filter((note, index) => index !== elementIndex);
};
export default deleteNoteById;

