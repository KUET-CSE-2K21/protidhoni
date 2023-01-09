import { EmbedBuilder } from 'discord.js';
import Command from '../Structure/Command.js'
import { SoftLog } from '../Structure/SoftLog.js';
import inputValidation from '../lib/inputValidation.js';
import InteractionErr from '../Structure/InteractionErr.js'
import informationM from '../Structure/Schema/information.js';
import { encryptAES, encryptRSA } from '../lib/modEncrypt.js';
import config from '../config.js'
import id from '../id.js';
import mongoose from 'mongoose';
let key = config.mrestkey
let tkey = config.rsa_public
let tkeyf = config.rsa_public_f //different key for female;not implemented yet
let salt = config.salt
let information = new Command({
	users: {
		supreme: [],
		allowed: [],
		forbidden: []
	},
	roles: {
		supreme: [],
		allowed: [id.roles.Managers],//change this on prodcution
		forbidden: []
	},
	channels: {
		allowed: [],
		forbidden: []
	}
}, async (interaction, client, attributes) => {
	//task add dupli checking
	//task #student contact?
	//task soft log> 
	let roll = await interaction.options.getInteger('roll')
	if (roll < 0 || roll >= 120) return //handle this bruh
	let email = await interaction.options.getString('email')

	let phone = await interaction.options.getString('phone')
	if (InteractionErr(!inputValidation('phone', phone), interaction, {
		title: 'Invalid Phone no',
		description: 'Without +88,11 chars'
	})) return

	if (InteractionErr(!inputValidation('email', email), interaction, {
		title: 'Not a valid email',
		description: 'Please provide a valid email address.'
	})) return



	let blood = await interaction.options.getString('blood-group')
	if (InteractionErr(!inputValidation('blood', blood), interaction, {
		title: 'Not a valid blood group',
		description: 'Valid Example: A+'
	})) return

	let permanentAddress = await interaction.options.getString('permanent-address')
	let permanentAddressChunks = permanentAddress.split(';')
	if (permanentAddressChunks.slice(-1)[0].trim() == '') permanentAddressChunks.pop()
	if (InteractionErr((() => {
		if (permanentAddressChunks.length != 3) return true
		for (let i of permanentAddressChunks) if (i == '') return true
		return false
	})(), interaction, {
		title: 'Malformed permanent address',
		description: 'Please follow the foramtting guideline'
	})) return


	//task:check inside
	let localGuardian = await interaction.options.getString('local-gaurdian-or-room-mate')
	let localGuardianChunks = localGuardian.split(';')
	if (localGuardianChunks.slice(-1) == '') localGuardianChunks.pop()
	if (InteractionErr((() => {
		if (localGuardianChunks.length != 3) return true
		for (let i of localGuardianChunks) if (i == '') return true
		return false
	})()
		, interaction, {
		title: 'Malformed local guardian',
		description: 'Please follow the foramtting guideline'
	})) return
	//task : check inside

	let emergencyContact = await interaction.options.getString('emergency-contact')
	let emergencyContactChunks = emergencyContact.split(';')
	if (emergencyContactChunks.slice(-1)[0].trim() == '') emergencyContactChunks.pop()
	if (InteractionErr((() => {
		if (emergencyContactChunks.length != 3) return true
		for (let i of emergencyContactChunks) if (i == '') return true
		return false
	})(), interaction, {
		title: 'Malformed emergency contact',
		description: 'Please follow the foramtting guideline'
	})) return

	//task : check phone number
	let onlinePresence = await interaction.options.getString('online-presence')
	let onlinePresenceChunks = onlinePresence.split(';')
	if (onlinePresenceChunks.slice(-1)[0].trim() == '') onlinePresenceChunks.pop()
	let onlinePresences = []
	if (onlinePresence != '~') {
		if (InteractionErr((() => {
			for (let i of onlinePresenceChunks) {
				if (i == '') return true
				let splited = i.split(',')
				if (splited.length != 2 || splited[0] == '' || splited[1] == '') return true
				onlinePresences.push(splited)
			}
			return false
		})(), interaction, {
			title: 'Malformed online-presence',
			description: ' '
		})) return
	}
	let skills = await interaction.options.getString('skills')
	let skillsChunks = skills.split(';')

	if (skillsChunks.splice(-1)[0].trim() == '') skillsChunks.pop()
	if (InteractionErr((() => {
		for (let i of skillsChunks) if (i == '') return true
		return false
	})(), {
		title: 'Malformed skills',
		description: 'Please follow the foramtting guideline'
	})) return

	let birthdate = await interaction.options.getString('birthdate')
	let birthdateChunks = birthdate.split('/')
	if (birthdateChunks.slice(-1)[0].trim() == '') birthdateChunks.pop()
	birthdateChunks = birthdateChunks.map(Number)
	if (InteractionErr(inputValidation('birthdayarray', birthdateChunks, true)
		, interaction, {
		title: 'Malformed birthday',
		description: 'Please follow the foramtting guideline'
	})) return
	//notes
	let note = await interaction.options.getString('note');
	if (note == '~') note = ''
	let emergencyNote = await interaction.options.getString('emergency-note');
	if (emergencyNote == '~') emergencyNote = ''
	let gender = await interaction.options.getString('gender');
	if (InteractionErr(!(gender == 'm' || gender == 'f'), interaction, {
		title: 'Malformed gender text',
		description: 'm or f'
	})) return
	let rkey;
	switch (gender) {
		case 'm':
			rkey = tkey
			break
		case 'f':
			rkey = tkeyf
			break;
	}
	//fancy : trim all

	let INFORMATION = { //using defalt json as the data is in array, would use secure json if was object
		random: Math.floor(Math.random() * 100),//idk why
		roll: roll,
		name: attributes.member.displayName,
		email: email,
		phone: encryptRSA(JSON.stringify(phone), rkey),
		permanent_address: permanentAddressChunks,
		blood_group: blood,
		local_guardian: encryptRSA(JSON.stringify(localGuardianChunks), rkey),
		emergency_contact: encryptRSA(JSON.stringify(emergencyContactChunks), rkey),
		online_presence: onlinePresences,
		skills: skillsChunks,
		birthdate: birthdateChunks, //need to take it outside in future
		notes: note,
		emergency_note: encryptRSA(emergencyNote, rkey)
	}
	let information = new informationM({
		_id: mongoose.Types.ObjectId(),
		discord_user: attributes.id.toString(),
		data: encryptAES(JSON.stringify(INFORMATION), key, salt),
		editable: true, //should be false in productiom
		msgid: null
	})
	let save_ok = true;
	let no_dupli = true;
	await information.save().catch(async err => {
		if (err.code == 11000) {
			no_dupli = false
			console.error(err)
		} else { //handle
			save_ok = false
			console.error(err)
			return
		}
	})
	if (InteractionErr(!no_dupli, interaction, { title: 'Duplicate', description: 'Duplicate entry, please use /edit_information to edit your form' })) return
	if (InteractionErr(!save_ok, interaction, { title: 'Database Err', description: 'internal err' })) return
	//send contact card change _ with space and capitalize
	//done yay

	interaction.reply({ embeds: [(new EmbedBuilder()).setTitle('DONE!').setDescription('Yay! Successfully submitted!! \nThank you for your patience')], ephemeral: true })

})
	.setName('information')
	.setDescription('Information collection form. If you do not want to submit a information type "~"')
	.addIntegerOption(option =>
		option
			.setName('roll')
			.setDescription('Your roll')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('phone')
			.setDescription('Your phone no')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('email')
			.setDescription('Your email')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('blood-group')
			.setDescription('Your Blood group')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('permanent-address')
			.setDescription('format: Address first line;District;Division')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('local-gaurdian-or-room-mate')
			.setDescription('format: name;relation;phone number')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('emergency-contact')
			.setDescription('format: name;relation;phone number')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('online-presence')
			.setDescription('format: service1,link to profile;service2,id;...')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('skills')
			.setDescription('format: skill1;skill2;...')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('birthdate')
			.setDescription('format: dd/mm')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('note')
			.setDescription('extra information')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('emergency-note')
			.setDescription('extra information')
			.setRequired(true))
	.addStringOption(option =>
		option
			.setName('gender')
			.setDescription('required for key selection,this value will not be stored in database')
			.setRequired(true))
export default information;

