const bcrypt = require('bcrypt');

function randomID(length) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports.randomPassword = (length) => {
	const randID = randomID(length);
	bcrypt.hash(randID, 10, (error, encrypted) => {
		if (error) throw new Error(error.message);
		return encrypted;
	});
};
