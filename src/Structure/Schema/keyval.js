import { Schema, model } from "mongoose"
const keyval = new Schema({
	_id: Schema.Types.ObjectId,
	key: { type: Schema.Types.String, unique: true },
	val: Schema.Types.String
})
const keyvalM = new model("KeyVal", keyval, "keyval")
export default keyvalM;