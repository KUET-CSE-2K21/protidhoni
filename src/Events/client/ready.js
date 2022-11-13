import Processes from "../../Processes/index.js"
const ready = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[Client] Bot Online! Logged in as ${client.user.tag}`)
		Processes(client)
	}
}
export default ready