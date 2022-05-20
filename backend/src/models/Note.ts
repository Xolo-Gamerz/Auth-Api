import {Schema, model} from "mongoose"
import NoteType from "../interfaces/Note"
import NoteChildSchema from "./NoteChild"
const NoteSchema = new Schema<NoteType>({
    userId: String,
    notes: [NoteChildSchema]
})
const Note = model("Notes",NoteSchema)
export default Note