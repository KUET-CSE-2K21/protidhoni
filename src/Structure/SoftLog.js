import { EmbedBuilder } from "discord.js";
import config from "../config.js";
import id from '../id.js'
export function SoftLog(member, title, description, type) {
	const channel = member.guild.channels.cache.get(config.mode == "test" ? id.channels.Test : id.channels.SoftLog)
	const embed = new EmbedBuilder()
		.setTitle(title)
		.setAuthor({ name: member.nickname, iconURL: member.displayAvatarURL({ size: 1024, dynamic: true }) })
		.setDescription(description)
		.setTimestamp()
	if (type = "warn") embed.setColor("#ff0000")
	if (type = "okay") embed.setColor("#00ff00")
	channel.send({ embeds: [embed] });
}