import {Schema, model} from "mongoose"
import NoteType from "../interfaces/Note"
const NoteSchema = new Schema<NoteType>({
    noteId: String,
    title: String,
    description: String,
    category: String,
    date:{ type: Date , default: Date.now}
})
const Note = model("Notes",NoteSchema)
export default Note