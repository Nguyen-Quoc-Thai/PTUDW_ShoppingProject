const nodemailer = require('nodemailer');

const { emailTemplate } = require('./../utils/constant');

const HOST_MAIL = process.env.HOST_MAIL;
const HOST_PASSWORD = process.env.HOST_PASSWORD;

// create reusable transporter object using the default SMTP transport
exports.sendMail = (req, receiver, token, type) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: HOST_MAIL, // generated ethereal user
			pass: HOST_PASSWORD, // generated ethereal password
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	// Url for confirm account & recovery password
	const urlConfirmation = `http://${req.hostname}/user/confirm/${token}`;
	const urlRecovery = `http://${req.hostname}/user/forgot/${token}`;

	// Email confirm
	const mailOptionsConfirmation = {
		from: '"The R2W ✔ "<bathanggayk18@gmail.com>', // sender address
		to: receiver, // list of receivers
		subject: 'Verify you account', // Subject line
		text: '',
		html: emailTemplate('confirm', receiver, urlConfirmation),
	};

	// Email recovery
	const mailOptionsRecovery = {
		from: '"The R2W ✔ "<bathanggayk18@gmail.com>', // sender address
		to: receiver, // list of receivers
		subject: 'Recovery password', // Subject line
		text: '',
		html: emailTemplate('confirm', receiver, urlRecovery),
	};

	// Send mail with defined transport object
	transporter.sendMail(
		type === 'confirm' ? mailOptionsConfirmation : mailOptionsRecovery,
		(error, data) => {
			if (error) {
				console.log({
					msg: 'error',
					error,
				});
			} else {
				console.log({
					msg: `Send the email to ${receiver} is successfully!`,
				});
			}
		}
	);
};
