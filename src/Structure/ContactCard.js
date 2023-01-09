import { EmbedBuilder } from "discord.js";
import config from "../config.js";
import id from '../id.js'
export const ContactCard = function (member, data, privateData, interaction, ephemeral) {
	let channel = interaction.guild.channels.cache.get(config.mode == "test" ? id.channels.Test : id.channels.StudentContacts)
	let embedPO = [];
	(() => {
		if (Object.keys(data).length !== 0) for (const [i, value] of Object.entries(data)) {
			embedPO.push({ name: i, value: data[i], inline: true })
		}
	})()
	let description = "";
	(() => {
		if (Object.keys(privateData).length !== 0) for (const [i, value] of Object.entries(privateData)) {
			description += `${i}\n
											\`\`\`${privateData[i]}
											\`\`\`
											\n
										`
		}
	})()
	if (description == '') description = '__ __ __ __ __'
	let embed = new EmbedBuilder()
		.setTitle(member.nickname)
		.setAuthor({ name: member.nickname, iconURL: member.displayAvatarURL({ size: 1024, dynamic: true }) })
		.setThumbnail(member.displayAvatarURL({ size: 1024, dynamic: true }))
		.setTimestamp()
		.addFields(embedPO)
		.setDescription(description);

	//public data as fields
	//private data on description


	///should return message id
	try {
		if (!ephemeral) ephemeral = false
		if (interaction)
			interaction.reply({ embeds: [embed], ephemeral: ephemeral })
		else
			channel.send({ embeds: [embed] })
	} catch (e) {
		console.log(err)
		return false
	}
	return true
}