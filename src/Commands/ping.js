import { SlashCommandBuilder } from 'discord.js';
import config from '../config.js'
import Command from '../Structure/Command.js'
let ping = new Command(config.commands.ping.permisions, async (interaction, client, attributes) => {
	await interaction.reply('Pong!')
})
	.setName('ping')
	.setDescription('Replies with Pong!')
export default ping;
