const nodemailer = require("nodemailer");

const user = process.env.HOST_MAIL;
const pass = process.env.HOST_PASSWORD;

// create reusable transporter object using the default SMTP transport
exports.sendMail = (req, receiver, token, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const urlConfirmation = `http://${req.hostname}/user/confirm/${token}`;
  const urlRecovery = `http://${req.hostname}/user/forgot/${token}`;

  const mailOptionsConfirmation = {
    from: '"The R2W ✔ "<bathanggayk18@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "Verify you account", // Subject line
    text:
      "Come with me. Welcome to the new life! \n\n Please click on the below link to verify your account\n", // plain text body
    html: `<b>Link: </b> <hr> <a href=${urlConfirmation}>${urlConfirmation}</a>\n\n<h6>Meet my team. Who make awesome stuff!</h6>`, // html body
  };

  const mailOptionsRecovery = {
    from: '"The R2W ✔ "<bathanggayk18@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "Recovery password", // Subject line
    text: `Your token here. Please copy and paste to form to reset password account! \n\n`, // plain text body
    html: `<b>Link: </b> <hr> <a href=${urlRecovery}>${urlRecovery}</a> \n\n <p>If you don't do this, ignore this email!</p>`, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(
    type === "confirmation" ? mailOptionsConfirmation : mailOptionsRecovery,
    (error, data) => {
      if (error) {
        console.log({
          msg: "error",
          error,
        });
      } else {
        console.log({
          msg: "success",
          data,
        });
      }
    }
  );
};
