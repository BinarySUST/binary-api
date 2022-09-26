import { model, Schema } from "mongoose";
import { GROUP } from "./schemaNames";

const groupSchema = new Schema({
    name: { type: String, require: true },
})

const Group = model(GROUP, groupSchema)

export default Group;