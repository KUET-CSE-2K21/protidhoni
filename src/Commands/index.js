import { Collection } from 'discord.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const Commands = new Collection()
export const commands_data = []




function load(command) {
	if (command === undefined) {
		console.log('command loading err undefined')
		return;
	}
	if ('execute' in command) {
		commands_data.push(command.toJSON())
		Commands.set(command.name, command);
	} else {
		console.log(`[WARNING] The command at ${__dirname} is missing a required "data" or "execute" property.`);
	}
}

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	if (file == 'index.js' || file == 'auth.js') continue;
	const filePath = path.join(__dirname, file);
	const command = (await import(filePath)).default;
	load(command)
}