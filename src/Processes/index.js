import globalNotices from "./globalNotices.js";
import cseNotices from "./cseNotices.js";
async function Processes(client) {
	globalNotices.start(client)
	cseNotices.start(client)
}
export default Processes