import https from 'https'
import { parse } from 'node-html-parser'
import mongoose from 'mongoose'
import fs, { stat } from 'fs'
import { EventEmitter } from 'events'
import keyval from '../Structure/Schema/keyval.js'
import Notice from '../Structure/Notice.js'

/* Game Plan
Must be async
If first time/unknown will fetch 15 items max
#gnrlntc .media
check extra form in every step
check inititates every 30 minutes/ 12Hour/1 day?

Problem with this approach: if latest notice gets deleted it'll fetch all(limit)
maybe we can fetch two, then use second one as backup?
*/


// Constants
const URL = 'https://www.kuet.ac.bd/department/CSE/'
//const SELECTOR = "#gnrlntc .media"
const SELECTOR_DATE = ".media .date_notice"
const REPEAT_AFTER = 60000 * 5
const ERROR_COOLDOWN = 6000000
const MAX_FETCH = 5
const KEY = "cseNotices"

//Runtime 
let RUNNING = true
let IS_FIRST_TIME = true //means first time run
let CYCLE = false //working or rest?
var TIMEOUT_ID = undefined
let CURRENT_ANNOUNCEMENTS_HASH = [];
let LAST_HASH = -1;
let NEW_HASH = -1;// (reset at save)
let TO_SEND = [] //reset after sent
let state = new EventEmitter()
var CLIENT = undefined

async function read_last_hash() {
	if (IS_FIRST_TIME) {
		var temp_hash = (await keyval.findOne({ key: KEY }).exec())
		if (!temp_hash) {
			var keYval = new keyval({
				_id: mongoose.Types.ObjectId(),
				key: KEY,
				val: LAST_HASH.toString()
			})
			await keYval.save().catch(async err => {
				if (err.code == 11000) {

				} else {
					console.log(err)
					state.emit('error')
				}
			})
			state.emit('reading_done')
		} else {
			temp_hash = temp_hash.val
			LAST_HASH = parseInt(temp_hash)
			IS_FIRST_TIME = false
			state.emit('reading_done')
		}
	} else {
		state.emit('reading_done')
	}
}
function hash(str) {
	// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	let hash = 0;
	for (let i = 0, len = str.length; i < len; i++) {
		let chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}
async function save_to_db() {
	//update
	LAST_HASH = NEW_HASH
	await keyval.findOneAndUpdate({ key: KEY }, { val: await LAST_HASH.toString() }).catch(err => console.log(err));
	state.emit('saving_done')
}
function send() {
	for (var i = TO_SEND.length - 1; i >= 0; i--) {
		Notice(CLIENT, "CSE", TO_SEND[i].text, TO_SEND[i].href, TO_SEND[i].date)
	}
	TO_SEND = []; //flush
}
function crawl() {
	const options = {
		method: 'GET'
	};
	let data = '';
	let request = https.request(URL, options, (res) => {
		if (res.statusCode !== 200) {
			console.error(`Did not get an OK from the server. Code: ${res.statusCode}`)
			res.resume()
			return
		}
		res.on('data', (chunk) => {
			data += chunk
		});
		res.on('close', () => {
			var parsed = (parse(data))
			//var a = parsed.querySelectorAll(SELECTOR)
			var date = parsed.querySelectorAll(SELECTOR_DATE)
			var media = date.map(r => r.parentNode)
			var limit = Math.min(MAX_FETCH, date.length)
			for (let i = 0; i < limit; i++) {
				var obj = {};
				var a = media[i].querySelector("a")
				obj.hash = hash(a.text)
				obj.href = a.getAttribute('href');
				obj.text = a.text;
				obj.date = date[i].text;
				CURRENT_ANNOUNCEMENTS_HASH.push(obj)
			}
			state.emit('crawling_done')
		});
	});
	request.end()
}

function compare() {
	if (CURRENT_ANNOUNCEMENTS_HASH.length == 0) state.emit('error') //this should always be full
	for (let i in CURRENT_ANNOUNCEMENTS_HASH) {
		if (CURRENT_ANNOUNCEMENTS_HASH[i].hash == LAST_HASH) {
			break;
		} else {
			TO_SEND.push(CURRENT_ANNOUNCEMENTS_HASH[i])
		}
	}
	NEW_HASH = CURRENT_ANNOUNCEMENTS_HASH[0].hash;
	CURRENT_ANNOUNCEMENTS_HASH = [] //flush
	console.log(`[Process/cseNotices] to send : ${TO_SEND.length}`);
	state.emit('comparing_done')
}

state.on('saving_done', () => {
	CYCLE = false
	console.log("[Process/cseNotices] stop")
	TIMEOUT_ID = setTimeout(() => {
		IS_FIRST_TIME = false
		if (RUNNING)
			state.emit('go')
		console.log("[Process/cseNotices] restart")
	}, REPEAT_AFTER)
})
state.on('error', () => { console.log("err") })
state.on('saving_done', send)
state.on('comparing_done', save_to_db);//ok trigger
state.on('crawling_done', compare)
state.on('reading_done', crawl)
state.on('go', read_last_hash)
state.on('go', () => { CYCLE = true; console.log("[Process/cseNotices] start") })
let cseNotices = {
	start(client) {
		CLIENT = client
		state.emit('go')
	},
	pause() {
		RUNNING = false
	},
	resume() {
		RUNNING = true
	},
	force_update() {
		clearTimeout(TIMEOUT_ID)
		if (!CYCLE)
			state.emit('go')
	}
}
export default cseNotices