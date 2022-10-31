import { config as loadLocalEnvironment } from 'dotenv'
loadLocalEnvironment()
let config = {
	token: process.env.TOKEN,
	id: process.env.ID,
	guild_id: '1013805839770984500', //should not be a number
	channels: {},
	roles: {},
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
	commands: {
		ping: {
			permisions: {
				users: {
					supreme: [],
					allowed: [],
					forbidden: ['1014388228377301032']
				},
				roles: {
					supreme: [],
					allowed: ['1013838270221787268'],
					forbidden: []
				},
				channels: {
					allowed: [],
					forbidden: []
				}
			}
		}
	}
}
export default config