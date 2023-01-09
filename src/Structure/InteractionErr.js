import { EmbedBuilder, messageLink } from "discord.js";
const InteractionErrHandler = (interaction, message) => {
	const embed = new EmbedBuilder()
		.setTitle("Error : " + message.title)
		.setDescription(message.description)
		.setTimestamp()
	embed.setColor("#ff0000")
	interaction.reply({ embeds: [embed], ephemeral: true },);
	return true
}
const InteractionErr = (state, interaction, message) => {
	if (!state) return false
	else return InteractionErrHandler(interaction, message)
}
/* 
in err false means - no err
true mwans err
*/
export default InteractionErr