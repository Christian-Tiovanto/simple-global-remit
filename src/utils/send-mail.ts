import * as nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'christiantiovantowork@gmail.com',
    pass: 'jync frgy cuxx drzf ',
  },
});

export function sendMail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: 'christiantiovantowork@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
