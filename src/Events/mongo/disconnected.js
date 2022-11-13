const disconnected = {
	name: "disconnected",
	async execute() {
		console.log("[Database] disconnected")
		throw "[Database] disconnected"
	}
}
export default disconnected;