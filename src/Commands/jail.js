import { PermissionFlagsBits } from 'discord.js';
import Command from '../Structure/Command.js'
import id from '../id.js'
import { SoftLog } from '../Structure/SoftLog.js';
let jail = new Command({
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

	//	if(message.member.highestRole.comparePositionTo(message.mentions.members.first().highestRole) > 0){
	//    //member has higher role then first mentioned member
	//    message.mentions.members.first().ban();
	//}

	if (roles.includes(id.roles.Jailed)) {
		interaction.reply('Already Jailed!')
		return
	}

	for (var i = 0; i < roles.length; i++) {
		await member.roles.remove(roles[i])
	}

	await member.roles.add(id.roles.Announcement)
	await member.roles.add(id.roles.Jailed)

	await SoftLog(member, "User Jailed", `<@${interaction.member.id}> has jailed <@${member.id}> for ${reason}`, "warn")
	await interaction.reply('Successfuly Jailed!')
	//softlog
})
	.setName('jail')
	.setDescription('Jails a user')
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to jail')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('Why he is getting jailed')
			.setRequired(true))
export default jail;

