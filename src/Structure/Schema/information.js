import { Schema, model } from "mongoose"
const information = new Schema({
	_id: Schema.Types.ObjectId,
	discord_user: { type: Schema.Types.String, unique: true }, //make this one unique
	data: Schema.Types.String,
	editable: Schema.Types.Boolean,
	msgid: Schema.Types.String
})
const informationM = new model("information", information, "information")
export default informationM;