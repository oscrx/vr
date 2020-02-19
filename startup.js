// Import Modules
if (process.env.NODE_ENV !== 'production') require('dotenv').config() // use an .env file for configuration in development

const mail = require('./handlers/mail')
const getData = require('./handlers/netboxdata')

// Check if config is set
try {
  if (!process.env.NETBOX_URI) throw new Error('Please enter the netbox uri.')
  if (!process.env.NETBOX_TOKEN) throw new Error('Please enter the netbox token.')
  if (!process.env.SMTP_SERVER) throw new Error('Please set an smtp server.')
  if (!process.env.SMTP_FROM) throw new Error('Please set a from email address.')
  if (!process.env.SMTP_TO) throw new Error('Please set some comma separated email addresses.')
} catch (error) {
  console.error(error)
  console.error('Committing suicide..')
  process.exit()
}

// get all tenants
getData('/tenancy/tenants')
  .then(function (response) {
    // make an array for requests that need to take place
    const tenants = []
    for (const id in response.results) { // get the tenant id's from the returned object
      tenants.push(getData('/virtualization/virtual-machines/?limit=500&tenant_id=' + id))
    }
    // wait for all results and return them
    return Promise.allSettled(tenants)
      .catch((e) => {
        console.error(e)
      })
  })
  .then(function (results) {
    // TODO filter out tenants without vm's or implement an api call that figures this out before vm's are requested

    console.log(results)
    // console.log(JSON.stringify(results))

    const vms = results
    return vms
  })
  .then(function (results) {
    const sorted = {}
    // TODO sort vm's

    return sorted
  })
  .then(function (results) {
    const attachments = []
    // TODO Create attachments from results

    return attachments
  })
  .then(function (attachments) {
    // mail(attachments)
  })
  .catch((e) => {
    // TODO send mail with script failures to systeembeheer@mybit.nl
    console.error(e)
  })
