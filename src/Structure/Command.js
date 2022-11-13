import { SlashCommandBuilder } from 'discord.js';
import Returns from './Returns.js'
import config from '../config.js'
class Command extends SlashCommandBuilder {
	constructor(permissions, execute) {
		super()
		var that = this
		this.permissions = permissions
		this.execute = async (interaction, client) => {
			var perm_check = that.permission_check(interaction, that.permissions);
			var err_resp = ""
			for (let i = 0; i < perm_check.errors.length; i++) err_resp += perm_check.errors[i]
			if (err_resp != "") await interaction.reply(err_resp)
			if (perm_check.overall) execute(interaction, client, perm_check.returns)
		}
	}
	permission_check(interaction, permissions) {
		/*	
		 * Global Supreme, Command supreme  (No block check)
		 * Permissions
		 *			->Users
		 *			->Channels
		 *			->Roles
		 * Allowed|Forbidden
		 * blank|some				; Allow all except some
		 * some|blank				; Allow some block all
		 * blank|blank			; Allow all
		 * some|some				; Allow some , block from allowed
		 */

		//Users

		let ret = new Returns()
		ret.returns.user = interaction.member
		ret.returns.roles = ret.returns.user._roles
		ret.returns.channel = interaction.channel


		let flag = false;

		//add global blck here
		//should i check all user's all role instead but m*n=n*m
		//global supreme
		for (let i = 0; i < config.global_permissions.users.length; i++) if (ret.returns.id == global_permisions.users[i]) return ret
		for (let i = 0; i < config.global_permissions.roles.length; i++) if (ret.returns.roles.includes(global_permisions.roles[i])) return ret
		for (var i = 0; i < config.global_permissions.users.forbidden.length; i++) if (ret.returns.user == config.global_permissions.users.forbidden[i]) { ret.pushErr("user blocked"); return ret; }
		for (let i = 0; i < config.global_permissions.roles.forbidden.length; i++) if (ret.returns.roles.includes(config.global_permissions.roles.forbidden[i])) { ret.pushErr("role forbidden"); return ret }
		//command supreme
		for (let i = 0; i < permissions.users.supreme.length; i++) if (ret.returns.id == permisions.users.supreme[i]) return ret
		for (let i = 0; i < permissions.roles.supreme.length; i++) if (ret.returns.roles.includes(permisions.roles.supreme[i])) return ret

		//Blockcheck starts from here

		// User
		flag = true//Forbidden
		for (var i = 0; i < permissions.users.forbidden.length; i++) if (ret.returns.user == permissions.users.forbidden[i]) { ret.pushErr("user blocked"); return ret; }

		flag = false //Allowed
		for (var i = 0; i < permissions.users.allowed.length; i++) if (ret.returns.user == permissions.users.allowed[i]) flag = true
		if (!flag && permissions.users.allowed.length != 0) { ret.pushErr("user not allowed"); return ret }

		//Channel
		flag = true //Forbidden
		for (var i = 0; i < permissions.channels.forbidden.length; i++) if (ret.returns.channel == permissions.channels.forbidden[i]) { ret.pushErr("channel blocked"); return ret; }

		flag = false //Allowed
		for (var i = 0; i < permissions.channels.allowed.length; i++) if (ret.returns.channel == permissions.channels.allowed[i]) flag = true
		if (!flag && permissions.channels.allowed.length != 0) { ret.pushErr("channel not allowed"); return ret }

		//Roles
		flag = true
		for (let i = 0; i < permissions.roles.forbidden.length; i++) if (ret.returns.roles.includes(permissions.roles.forbidden[i])) { ret.pushErr("role forbidden"); return ret }
		flag = false
		for (let i = 0; i < permissions.roles.allowed.length; i++) if (ret.returns.roles.includes(permissions.roles.allowed[i])) flag = true
		if (!flag && permissions.roles.allowed.length != 0) { ret.pushErr("role not allowed"); return ret }


		return ret
	}
}
export default Command