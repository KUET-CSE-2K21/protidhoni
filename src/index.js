import { Events, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import config from './config.js'
import { Commands } from './Commands/index.js'
import { update_commands } from './update_commands.js';


update_commands();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = Commands.get(interaction.commandName);
	if (!command) return;
	try { await command.execute(interaction); }
	catch (error) {
		console.error(error);
		try { await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); } catch (e) { console.error(e) }
	}
});

client.login(config.token)
