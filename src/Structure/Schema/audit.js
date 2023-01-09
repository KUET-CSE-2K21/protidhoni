import { Schema, model } from "mongoose"
const audit = new Schema({
	_id: Schema.Types.ObjectId,
	whoIsAsking: Schema.Types.String,
	ofWhom: Schema.Types.String,
	type: Schema.Types.String,
	whichData: Schema.Types.String,
	why: Schema.Types.String,
	wasPermitted: Schema.Types.Boolean
})
const auditM = new model("audit", audit, "audit")
export default auditM;