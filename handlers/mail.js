// check_mk script to check TCP connections to a remote host.
// written to report netbox resources monthly per tenant in pdf.
// Djamon Staal <djamon.staaal@mybit.nl> - 2020

'use strict';

// Import Modules
const moment = require('moment');
const nodemailer = require("nodemailer");

class VRreport extends nodemailer {
  constructor(options) {
    super(options);
  }

  send(files) {

    // TODO: Process files

    let transporter = nodemailer.createTransport({
      host: config.smtp_server,
      port: config.smtp_port,
      secure: config.smtp_secure,
      tls: {
        rejectUnauthorized: config.smtp_tls_rejectUnauthorized
      }
    });

    let info = transporter.sendMail({
      from: config.smtp_from, // sender address
      to: config.smtp_to, // list of receivers
      subject: "Virtualisatie Rapport - " + moment().format('DD MMMM YYYY'), // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    });
  }
}
