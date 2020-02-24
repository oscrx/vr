// Import Modules
if (process.env.NODE_ENV !== 'production') require('dotenv').config() // use an .env file for configuration in development
require('events').EventEmitter.defaultMaxListeners = 100
const image = require('image-data-uri')
const mail = require('./handlers/mail')
const getData = require('./handlers/netboxdata')
const pdfGenerator = require('./handlers/pdf-generator')

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

global.total = { // create place to store total vm resource usage
  disk: 0,
  memory: 0,
  vcpus: 0,
  network_storage: 0
}

const data = {}
// get all tenants
console.log('Started at ' + Date())
getData('/tenancy/tenants')
  .then(function (response) {
    // make an array for requests that need to take place
    const requests = []
    response.results.forEach(function (result) {
      requests.push(getData('/virtualization/virtual-machines/?limit=500&tenant_id=' + result.id))
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
    for (const id in data) {
      if (data[id].vms) { // check if tenant has vm's
        const sorted = {}
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
      } else {
        delete data[id] // This tenant does not have any vm's so let's delete it
      }
    }
  })
  .then(function () {
    const logos = []
    for (const id in data) {
      logos.push(image.encodeFromURL(data[id].custom_fields.logo) // download logo's and format them as data uri's
        .then(result => {
          data[id].logo = result
        })
      )
    }
    return Promise.allSettled(logos) // ignores rejected promises, debug missing logos in the pdf here
      .catch((e) => {
        console.error(e)
      })
  })
  .then(function () {
    const attachments = []
    for (const id in data) {
      attachments.push(pdfGenerator(data[id]))
    }

    return Promise.all(attachments)
      .catch((e) => {
        // TODO: send mail with script failures
        console.error(e)
      })
  })
  .then(function (attachments) {
    const text = `Bijgevoegd vind u de maandelijkse rapporten per partner. \n\n Het totale cpu verbruik: ${global.total.vcpus} vCPU's \n Het totale memory verbruik: ${(global.total.memory / 1024).toFixed(0)} GB \n Het totale disk verbruik: ${global.total.disk} GB \n Het totale netwerk storage verbruik: ${global.total.network_storage} TB (WIP) \n\n Met vriendelijke groet, \n MyBit systeembeheer`
    mail(attachments, text)
  })
  .catch((e) => {
    // TODO send mail with script failures
    console.error(e)
  })
