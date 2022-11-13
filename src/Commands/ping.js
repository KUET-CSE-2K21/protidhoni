import Command from '../Structure/Command.js'
let ping = new Command({
	users: {
		supreme: [],
		allowed: [],
		forbidden: []
	},
	roles: {
		supreme: [],
		allowed: [],
		forbidden: []
	},
	channels: {
		allowed: [],
		forbidden: []
	}
}, async (interaction, client, attributes) => {
	const message = await interaction.deferReply({
		fetchReply: true
	})
	await interaction.editReply(`Pong 🏓 ! Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
})
	.setName('ping')
	.setDescription('Replies with Pong!')
export default ping;
