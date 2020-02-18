// check_mk script to check TCP connections to a remote host.
// written to report netbox resources monthly per tenant in pdf.
// Djamon Staal <djamon.staaal@mybit.nl> - 2020

// Import Modules
const axios = require('axios')
const moment = require('moment');
const nodemailer = require("nodemailer");

// Load config
try {
  var config = require('./config');
} catch (e) {
  return console.log("Fatal Error: Faild to load the config file.")
}

// Start the service

