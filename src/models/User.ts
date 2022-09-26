import { model, Schema } from "mongoose";
import { USER } from "./schemaNames";

const userSchema = new Schema({
    uId: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    phone: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

const User = model(USER, userSchema)

export default User;