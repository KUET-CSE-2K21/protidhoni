import crypto from 'crypto'
const IV_LENGTH = 16;

//rsa is not quantumsafe
//do not modify after form submission.


export function encryptAES(text, key, salt) {

	key = sha512(key, salt).substring(0, 32)
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}
export function decryptAES(text, key, salt) {
	key = sha512(key, salt).substring(0, 32)
	let textParts = text.split(':');
	let iv = Buffer.from(textParts.shift(), 'hex');
	let encryptedText = Buffer.from(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}
export function encryptRSA(text, key) {
	return crypto.publicEncrypt(key, Buffer.from(text)).toString("base64")
}
export function decryptRSA(text, key, passphrase = '') {
	return crypto.privateDecrypt({ key: key, passphrase: passphrase }, Buffer.from(text)).toString("base64")
}
export function sha512(password, salt) { /// is there any need for salting?
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	return (hash.digest('base64'))
};