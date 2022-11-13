import { config as loadLocalEnvironment } from 'dotenv'
loadLocalEnvironment()
let config = {
	token: process.env.TOKEN,
	id: process.env.ID,
	mongo: `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}/Bot?retryWrites=true&w=majority`,
	guild_id: '1013805839770984500', //should not be a number
	mode: process.env.MODE,
	global_permissions: {
		users: {
			allowed: [],
			forbidden: []
		},
		roles: {
			allowed: [],
			forbidden: []
		}
	},

}
//if (config.mode == "test") config.global_permissions.roles.allowed.push('1013838270221787268')
export default config