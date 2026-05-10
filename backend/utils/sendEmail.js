const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Using ethereal.email for easy testing without needing real SMTP credentials
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let mailOptions = {
    from: '"MediCare Hospital" <noreply@medicare.com>',
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("-----------------------------------------");
  console.log("Email Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log("-----------------------------------------");
};

module.exports = sendEmail;
