// Import Modules
if (process.env.NODE_ENV !== 'production') require('dotenv').config() // use an .env file for configuration in development
const rp = require('request-promise')

const mailer = require('./handlers/mail')

// Load config
try {
  // if (!process.env.NODE_ENV) console.log('Please set the NODE_ENV')
  if (!process.env.NETBOX_URI) throw new Error('Please enter the netbox uri.')
  if (!process.env.NETBOX_TOKEN) throw new Error('Please enter the netbox token.')
  if (!process.env.SMTP_SERVER) throw new Error('Please set an smtp server.')
  if (!process.env.SMTP_PORT) console.log('No smtp port set.')
  if (!process.env.SMTP_FROM) throw new Error('Please set a from email address.')
  if (!process.env.SMTP_TO) throw new Error('Please set some comma seperated email addresses.')
} catch (error) {
  console.error(error)
  console.error('Committing suicide..')
  process.exit()
}

const getNetboxData = async (path, method) => {
  const options = { // move to envirioment variable?
    uri: process.env.NETBOX_URI + path,
    method: method || 'get',
    headers: {
      accept: 'application/json',
      Authorization: 'Token ' + process.env.NETBOX_TOKEN
    },
    json: true // Automatically parses the JSON string in the response
  }
  const response = await rp(options)
  // console.log(response)
  return response
}

// use this function asyncronous
console.log(getNetboxData('/api/virtualization/virtual-machines/?limit=5', 'get'))

mailer()
