import { config as loadLocalEnvironment } from 'dotenv'
loadLocalEnvironment()
let config = {
	token: process.env.TOKEN,
	id: process.env.ID,
	mongo: `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}/Bot?retryWrites=true&w=majority`,
	guild_id: '1013805839770984500', //should not be a number
	port: process.env.PORT,
	mode: process.env.MODE,
	mrestkey: process.env.MRESTKEY,
	salt: process.env.SALT,
	rsa_public: Buffer.from(process.env.RSA_PUBLIC, "base64").toString('utf-8'),
	rsa_public_f: Buffer.from(process.env.RSA_PUBLIC_F, "base64").toString('utf-8'),
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
if (config.mode == "test") config.rsa_private = Buffer.from(process.env.RSA_PUBLIC, "base64").toString('utf-8')
if (config.mode == "test") config.priv_pass = process.env.PRIV_PASS
//if (config.mode == "test") config.global_permissions.roles.allowed.push('1013838270221787268')
export default config


/*//////////////////////////////////////////////////////
@ WILL MOVE ALL CONFS and PERMS TO  MONGODB
@ for easy maintanace

////////////////////////////////////////////////////*/