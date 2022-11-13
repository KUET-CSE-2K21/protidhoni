const err = {
	name: "diconnected",
	execute(err) {
		console.log(`[Database] Error : ${err}`)
	}
}
export default err;