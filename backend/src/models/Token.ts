import { Schema , model } from "mongoose";
import TokenType from "../interfaces/Token";
const TokenSchema = new Schema<TokenType>({
    email: String,
    token: String
})
const Token = model("Token",TokenSchema)
export default Token