import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Command from '../Structure/Command.js'
import id from '../id.js'
import { SoftLog } from '../Structure/SoftLog.js';
import informationM from '../Structure/Schema/information.js';
import config from '../config.js'
import { decryptAES } from '../lib/modEncrypt.js';
import InteractionErr from '../Structure/InteractionErr.js';
import { ContactCard } from '../Structure/ContactCard.js';
import keyvalM from '../Structure/Schema/keyval.js';
import { audit } from '../Structure/audit.js';
import mongoose from 'mongoose';
let key = config.mrestkey
let tkey = config.rsa_public
let tkeyf = config.rsa_public_f //different key for female
let salt = config.salt
let view_information = new Command({
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
	var targetedUser = await interaction.options.getUser('user')
	let why = await interaction.options.getString('reason')
	//var targetMember = await interaction.guild.members.cache.get(targetedUser.id)
	let what = await interaction.options.getString('what')


	let publicData = ['bday', 'bld']
	let asked
	if (what == 'all') asked = ['bday', 'bld', 'phone', 'lg', 'en', 'ec']
	else asked = what.split(';')

	let isPrivate = false

	let type
	for (let i of asked) {
		if (publicData[0] != i && publicData[1] != i) { // check if not public
			//is trusted?
			//trusted will also get a trusted role
			type = 'private'
			// store trusted in keyval
			let trusted1male = (await keyvalM.findOne({ key: 'trusted1male' }).exec()).val
			let trusted2male = (await keyvalM.findOne({ key: 'trusted2male' }).exec()).val
			let trusted1female = (await keyvalM.findOne({ key: 'trusted1female' }).exec()).val
			let trusted2female = (await keyvalM.findOne({ key: 'trusted2female' }).exec()).val

			let trusted = false
			if (
				attributes.id == trusted1male ||
				attributes.id == trusted2male ||
				attributes.id == trusted1female ||
				attributes.id == trusted2female
			) trusted = true
			console.log(attributes.id)
			console.log(trusted1male)
			if (InteractionErr(!trusted, interaction, {
				title: "Not permitted",
				description: "This interaction will be audited"
			})) {
				audit(attributes.user.id, targetedUser.id, type, asked.join(','), why, 'Not trusted', false)
				return // if not permitted end
			}
			isPrivate = true
			break // this ensures - done
		} else if (type != 'private') type = 'public' //???
	}

	let whichData
	//take input as short form and set whichdata to full form // one loop in engough check and update
	//maybe seperated by comma, if includes any private data type=private
	//let type ; find type
	// if type == private procceed to next section else audit and give data



	let encryptedInformation = (await informationM.findOne({
		discord_user: targetedUser.id.toString(),
	}))
	if (InteractionErr(encryptedInformation === undefined, interaction, { title: 'Not found', description: 'The user hasn\'t yet filled up the form' })) return
	//task :check decryption failure, set decryptAES to undefined and check here
	let dData
	let data
	try {
		dData = decryptAES(encryptedInformation.data, key, salt)
		if (InteractionErr(dData === undefined, interaction, { title: 'Internal Error', description: 'decryption failure' })) return
		data = JSON.parse(dData)
	} catch (e) {
		if (InteractionErr(dData === undefined, interaction, { title: 'Internal Error', description: e })) return
	}
	//let available_data = [
	//	['bday', 'Birthday'],
	//	['bld', 'Blood Group']
	//	['phone', 'Phone Number'],
	//	['lg', 'Local Gaurdian'],
	//	['en', 'Emergency Note'],
	//	['ec', 'Emergency Contact'],
	//	['all', 'All Data'], // if has access with all private // else kick
	//]
	let publicD = {}
	let privateD = {}
	//send as ephemeral`
	console.log(data)
	for (let i of asked) {
		console.log(i)
		switch (i.trim()) {
			case 'bday':
				publicD['Birthday'] = `${data.birthdate[0]}/${data.birthdate[1]}`
				break;
			case 'bld':
				console.log(data.blood_group)
				publicD['Blood Group'] = data.blood_group
				break;
			case 'phone':
				privateD['Phone'] = data.phone
				break;
			case 'lg':
				privateD['Local Guardian'] = data.local_guardian
				break
			case 'en':
				privateD['Emergency Note'] = data.emergency_note
				break
			case 'ec':
				privateD['Emergency Contact'] = data.emergency_contact
				break
			default:
				InteractionErr(true, interaction, {
					title: 'Not a valid option',
					description: 'select form all;bday;bld;phone;lg;en;ec' //unnecc for now
				})
		}
	}
	let fetchedData = ''
	console.log(publicD)
	console.log(privateD)
	if (Object.keys(publicD).length !== 0) for (const [key, value] of Object.entries(publicD)) fetchedData += key + ','
	if (Object.keys(privateD).length !== 0) for (const [key, value] of Object.entries(privateD)) fetchedData += key + ','
	console.log(targetedUser)
	if (InteractionErr(!ContactCard(interaction.guild.members.cache.get(targetedUser.id), publicD, privateD, interaction, true), interaction, {
		title: 'Failed to show data',
		description: '..'
	})) {
		audit(attributes.user.id, targetedUser.id, type, publicData.join(',') + ',' + privateD, why, 'Allowed', false)
		return
	}
	//console.log(data)
	//const embed = new EmbedBuilder()
	//	.setTitle('Information')
	//	.setDescription()
	//	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	//	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	//	.addFields(
	//		{ name: 'Regular field title', value: 'Some value here' },
	//		{ name: '\u200B', value: '\u200B' },
	//		{ name: 'Inline field title', value: 'Some value here', inline: true },
	//		{ name: 'Inline field title', value: 'Some value here', inline: true },
	//	)
	//	.setTimestamp()
	//	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
	//
	//task: add auditing

	//softlog
})
	.setName('view-information')
	.setDescription('View information of user')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('Select user')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('Why?')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('what')
			.setDescription(`
			Seperated by ; 
	bday;phone;all;en;eg;lg;bld
	`)
			.setRequired(true)
	)
export default view_information;

