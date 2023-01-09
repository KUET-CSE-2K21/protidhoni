import { generateKeyPair } from 'crypto'
import { env } from 'process'
import fs from 'fs'
console.log(generateKeyPair('rsa', {
	modulusLength: 4096,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: env.PRIV_PASS
	}
}, (err, publicKey, privateKey) => {
	fs.writeFileSync('./keys/private', Buffer.from(privateKey).toString("base64"))
	fs.writeFileSync('./keys/public', Buffer.from(publicKey).toString("base64"))
}))
