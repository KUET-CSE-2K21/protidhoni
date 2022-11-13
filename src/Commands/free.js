import { PermissionFlagsBits } from 'discord.js';
import Command from '../Structure/Command.js'
import { SoftLog } from '../Structure/SoftLog.js'
import id from '../id.js'
let free = new Command({
	users: {
		supreme: [],
		allowed: [],
		forbidden: []
	},
	roles: {
		supreme: [],
		allowed: [id.roles.Managers],
		forbidden: []
	},
	channels: {
		allowed: [],
		forbidden: []
	}
}, async (interaction, client, attributes) => {
	var target = await interaction.options.getUser('target')
	var reason = await interaction.options.getString('reason')
	var member = await interaction.guild.members.cache.get(target.id)
	var roles = await member._roles;

	if (roles.includes('1015661325898231860')) {
		for (var i = 0; i < roles.length; i++)
			await member.roles.remove(roles[i])
		await member.roles.add('1015646619158446101')

		await SoftLog(member, "User Freed", `<@${interaction.member.id}> has freed <@${member.id}> for ${reason}`, "okay")
		await interaction.reply('Freed!')
		return
	} else interaction.reply('Not Jailed!')
})
	.setName('free')
	.setDescription('Frees a user')
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to free')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('Why he is being freed')
			.setRequired(true))
export default free;

