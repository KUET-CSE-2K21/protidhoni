const https = require('https')
const HTMLParser = require('node-html-parser')
const fs = require('fs')
const events = require('events')
const state = new events.EventEmitter()
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(process.env.DiscordBracUAnnoncementWebhook)


//Preset
const URL = 'https://www.bracu.ac.bd'
const SELECTOR = ".announcements a"
const SELECTOR_DATE = ".announcements span.date"
const LAST_HASH_FILE = 'lasthash'
const REPEAT_AFTER = 60000
const ERROR_COOLDOWN = 6000000
const HOOK_NAME = "KUET-HALP"
//
var IS_FIRST_LOAD = true //means first main
var IS_FIRST_TIME = true //means first time run
var CURRENT_ANNOUNCEMENTS_HASH = [];
var LAST_HASH = -1;
//Runtime 
var NEW_HASH = -1;// (reset at save)
var TO_SEND = [] //reset after sent


function read_last_hash() {
	try {
		if (fs.existsSync(LAST_HASH_FILE)) {
			IS_FIRST_TIME = false;
			try {
				IS_FIRST_LOAD = false;
				LAST_HASH_RAW = (fs.readFileSync(LAST_HASH_FILE, 'utf8'));
				if (LAST_HASH_RAW != "") {
					LAST_HASH = Number(LAST_HASH_RAW);
					state.emit('reading_done')
				}
			} catch (err) {
				console.error(err);
				state.emit(err);
			}
		} else {
			state.emit('reading_done')
		}
	} catch (err) {
		console.error(err)
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
function save_to_file() {
	LAST_HASH = NEW_HASH;
	fs.writeFileSync(LAST_HASH_FILE, NEW_HASH.toString())
	state.emit('saving_done')
}
async function send() {
	for (i = TO_SEND.length - 1; i >= 0; i--) {
		var embed = new MessageBuilder()
			.setTitle("Announcement")
			.setAuthor(HOOK_NAME, 'https://www.kuet.ac.bd/libs/img/logo.png', 'https://www.kuet.ac.bd/department/CSE/')
			.setURL(URL + TO_SEND[i].href)
			.setColor('#00b0f4')
			.setDescription(TO_SEND[i].innerHTML)
			.setFooter(TO_SEND[i].date)
		await hook.send(embed);
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
			var parsed = (HTMLParser.parse(data))
			var a = parsed.querySelectorAll(SELECTOR)
			var b = parsed.querySelectorAll(SELECTOR_DATE)
			for (i in a) {
				var obj = {};
				obj.hash = hash(a[i].href + a[i].innerHTML)
				obj.href = a[i].getAttribute('href');
				obj.innerHTML = a[i].text;
				obj.date = b[i].text;
				CURRENT_ANNOUNCEMENTS_HASH.push(obj)
			}
			state.emit('crawling_done')
		});
	});
	request.end()
}
function compare() {
	if (CURRENT_ANNOUNCEMENTS_HASH.length == 0) state.emit('error') //this should always be full
	var reach = false;
	for (i in CURRENT_ANNOUNCEMENTS_HASH) {
		if (CURRENT_ANNOUNCEMENTS_HASH[i].hash == LAST_HASH) {
			NEW_HASH = CURRENT_ANNOUNCEMENTS_HASH[i].hash;
			reach = true;
			break;
		} else {
			TO_SEND.push(CURRENT_ANNOUNCEMENTS_HASH[i])
		}
		if (!reach) {
			NEW_HASH = CURRENT_ANNOUNCEMENTS_HASH[0].hash;
		}
	}
	CURRENT_ANNOUNCEMENTS_HASH = [] //flush
	console.log(TO_SEND.length);
	state.emit('comparing_done')
}
/*
 *	@  
*/
state.on('error', () => {
	state.removeAllListeners();
	IS_FIRST_LOAD = true;
	IS_FIRST_TIME = true;
	CURRENT_ANNOUNCEMENTS_HASH = [];
	LAST_HASH = -1;
	NEW_HASH = -1;
	TO_SEND = []
	loop()
	setTimeout(emit('go'), ERROR_COOLDOWN)
})

function loop() {
	state.on('saving_done', () => { setTimeout(() => { IS_FIRST_LOAD = false; IS_FIRST_TIME = false; state.emit('go') }, REPEAT_AFTER) })
	state.on('saving_done', send)
	state.on('comparing_done', save_to_file);//ok trigger
	state.on('crawling_done', compare)
	state.on('reading_done', crawl)
	state.on('go', read_last_hash)
}
loop();
state.emit('go')