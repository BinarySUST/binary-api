import { model, Schema } from "mongoose";
import { USER_META } from "./schemaNames";

const userMetaSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    full_name: {
        type: String
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    institution: {
        type: String
    },
    department: {
        type: String
    },
    session: {
        type: String
    },
    reg_no: {
        type: String
    },
    address: {
        present: {
            type: String
        },
        permanent: {
            type: String
        }
    },
    blood: {
        type: String
    }
})

const UserMeta = model(USER_META, userMetaSchema);

export default UserMeta;