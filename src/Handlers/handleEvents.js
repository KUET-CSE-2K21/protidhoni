import fs from 'fs'
import mongo from 'mongoose'
var connection = mongo.connection;
let handleEvents = (client) => {
	client.handleEvents = async () => {
		const eventsFolders = fs.readdirSync('./src/Events')
		for (const folder of eventsFolders) {
			const eventFiles = fs.readdirSync(`./src/Events/${folder}`).filter((file) => file.endsWith('.js'))
			switch (folder) {
				case "client":
					for (const file of eventFiles) {
						const event = (await import(`../Events/${folder}/${file}`)).default;
						if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
						else client.on(event.name, (...args) => event.execute(...args, client))
					}
					break;
				case "mongo":
					for (const file of eventFiles) {
						const event = (await import(`../Events/${folder}/${file}`)).default;
						if (event.once) connection.once(event.name, (...args) => event.execute(...args, client))
						else connection.on(event.name, (...args) => event.execute(...args, client))
					}
					break;
				default:
					break;
			}
		}
	}
}
export default handleEvents