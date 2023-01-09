import auditM from "./Schema/audit.js";
import mongoose from "mongoose";
export async function audit(whoIsAsking, ofWhom, type, whichData, why, why_na, wasPermitted) {
	let ret = true
	let Audit = new auditM({
		_id: mongoose.Types.ObjectId(),
		whoIsAsking: whoIsAsking,
		ofWhom: ofWhom,
		type: type,
		whichData: whichData,
		why: why,
		why_na: why_na,
		wasPermitted: wasPermitted
	})
	await Audit.save().catch(async err => {
		console.log(err)
		ret = false
	})
	return ret
}
//should be called with await