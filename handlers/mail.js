// Import Modules
const moment = require('moment')
const nodemailer = require('nodemailer')

const Mailer = (attachments) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT || 25,
    // secure: process.env.SMTP_SECURE || false,
    secure: false,
    tls: {
      // rejectUnauthorized: process.env.SMTP_REJECTUNAUTHORIZED || false
      rejectUnauthorized: false
    }
  })

  transporter.sendMail({
    from: process.env.SMTP_FROM, // sender address
    to: process.env.SMTP_TO, // list of receivers
    subject: 'Virtualisatie Rapport - ' + moment().format('DD MMMM YYYY'), // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
    attachments: attachments // pdf attachments
  })
}

module.exports = Mailer
