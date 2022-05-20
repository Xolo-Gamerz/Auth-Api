import { Schema} from "mongoose";
import NoteChildType from "../interfaces/NoteChild";
const NoteChildSchema = new Schema<NoteChildType>({
    noteId: {type : String , unique: true},
    title: String,
    description: String,
    category: String,
    date:{ type: Date , default: Date.now}
})
export default NoteChildSchema