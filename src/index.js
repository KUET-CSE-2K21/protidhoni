
import { Client, GatewayIntentBits } from 'discord.js'
import fs from 'fs'
import { connect } from 'mongoose';
import config from './config.js'
import id from './id.js';
import server from './server.js';
server.listen(config.port, () => {
	console.log("[Server] up")
})
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const eventFiles = fs.readdirSync("./src/Handlers/").filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
	if (file == 'index.js' || file == 'auth.js') continue
	(await import(`../src/Handlers/${file}`)).default(client)
}
await client.updateCommands()
await client.handleEvents()
await connect(config.mongo).catch(console.error)
client.login(config.token)

