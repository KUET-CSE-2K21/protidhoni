import config from '../config.js'
import { commands_data } from '../Commands/index.js'
import { Routes, REST } from 'discord.js';
const rest = new REST({ version: '10' }).setToken(config.token);

function updateCommands(client) {
	client.updateCommands = async () => {
		try {
			const data = await rest.put(
				Routes.applicationGuildCommands(config.id, config.guild_id),
				{ body: commands_data },
			);
		} catch (error) {
			console.error(error);
		}
	}
}
export default updateCommands
