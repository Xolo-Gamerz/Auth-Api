import { Schema, model } from "mongoose";
import UserType from "../interfaces/User";

const UserSchema = new Schema<UserType>({
    name: String,
    email : String,
    password: String,
    verified: {type: Boolean , default: false},
    date : {type: Date, default: Date.now}
})

const User = model("User",UserSchema)
export default User