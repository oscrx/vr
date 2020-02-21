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

const data = {}

// get all tenants
getData('/tenancy/tenants')
  .then(function (response) {
    // make an array for requests that need to take place
    const requests = []
    response.results.forEach(function (result) {
      requests.push(getData('/virtualization/virtual-machines/?limit=666&tenant_id=' + result.id))
      data[result.id] = result
    })
    return Promise.allSettled(requests)
      .catch((e) => {
        console.error(e)
      })
  })
  .then(function (results) {
    // TODO filter out tenants without vm's or implement an api call that figures this out before vm's are requested
    results.forEach(function (object) {
      if (object.value.count >= 1) {
        data[object.value.results[0].tenant.id].vms = object.value.results
      }
    })
  })
  .then(function () {
    const sorted = {}
    for (const id in data) {
      if (data[id].vms) { // check if tenant has vm's
        data[id].vms.forEach(function (vm) { // loop over all vm's
          if (/.*-acc$/.test(vm.name)) { // filter the accept vm's out
            if (!sorted.accept) {
              sorted.accept = {}
            }
            sorted.accept[vm.id] = vm
          } else if (/.*-test$/.test(vm.name)) { // filter the test vm's out
            if (!sorted.testing) {
              sorted.testing = {}
            }
            sorted.testing[vm.id] = vm
          } else if (/.*-demo$/.test(vm.name)) { // filter the demo vm's out
            if (!sorted.demo) {
              sorted.demo = {}
            }
            sorted.demo[vm.id] = vm
          } else { // the rest should be production vm's
            if (!sorted.production) {
              sorted.production = {}
            }
            sorted.production[vm.id] = vm
          }
          data[id].vms = sorted // replace unsorted vm's with sorted vm's
        })
      }
    }
  })
  .then(function () {
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
