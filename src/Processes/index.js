import globalNotices from "./globalNotices.js";
async function Processes(client) {
	globalNotices.start(client)
}
export default Processes