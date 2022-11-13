import { Commands } from '../../Commands/index.js'
const interactionCreate = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;
		const command = Commands.get(interaction.commandName);
		if (!command) return;
		try { await command.execute(interaction, client); }
		catch (error) {
			console.error(error);
			try { await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); } catch (e) { console.error(e) }
		}
	}
}
export default interactionCreate