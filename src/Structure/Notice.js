import { EmbedBuilder } from "discord.js";
import config from "../config.js";
import id from '../id.js'
function Notice(client, title, description, href, date) {
	var channel = client.channels.cache.get(id.channels.Test)//config.mode == "test" ? id.channels.Test : id.channels.Notices)
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setAuthor({ name: 'Khulna University of Engineering & Technology', iconURL: 'https://www.kuet.ac.bd/libs/img/logo.png', url: 'https://www.kuet.ac.bd/' })
		.setDescription(`[${description}](${href})`)
		.setFooter({ text: date.replace(/\s+/g, ' ').trim() })
	channel.send({ embeds: [embed] });
}
export default Notice
