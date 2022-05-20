import NoteChildType from "./NoteChild"
interface NoteType{
    userId: string
    notes: NoteChildType[]
}
export default NoteType