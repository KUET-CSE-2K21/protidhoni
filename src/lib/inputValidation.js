function email(email) {
	const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
	if (!email)
		return false
	if (email.length > 254)
		return false
	var valid = emailRegex.test(email)
	if (!valid)
		return false
	// Further checking of some things regex can't handle
	var parts = email.split("@")
	if (parts[0].length > 64)
		return false
	var domainParts = parts[1].split(".")
	if (domainParts.some(function (part) { return part.length > 63 }))
		return false
	return true
}
function blood(blood) {
	const bloodRegex = /^(A|B|AB|O)[+-]$/
	if (!blood) return false
	return bloodRegex.test(blood)
}
function check2birthdayArray(arr) {
	return isNaN(arr[0]) ||
		arr[1] == undefined ||
		isNaN(arr[1]) ||
		arr[0] > 31 || arr[0] < 1 ||
		arr[1] > 12 || arr[1] < 1
}
function phone_no(data) {
	const phoneRegex = /^(01)[0-9]{9}$/
	return phoneRegex.test(data)
}
let inputValidation = (type, data, allow_escape = false) => {
	if (allow_escape && data == '~') return true
	switch (type) {
		case 'email':
			return email(data)
		case 'phone':
			return phone_no(data)
		case 'blood':
			return blood(data)
		case 'birthdayarray':
			return check2birthdayArray(data)

	}
}


export default inputValidation